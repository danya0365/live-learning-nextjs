-- ============================================================================
-- 1. COUPONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2), -- Cap for percentage discounts
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    usage_limit INT, -- Global limit
    usage_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- 2. PAYMENTS TABLE (Refactored)
-- ============================================================================
-- Decoupled from booking_id to allow course purchase before slot selection
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
    
    -- Transaction Info
    amount DECIMAL(10, 2) NOT NULL,            -- Final amount paid
    original_amount DECIMAL(10, 2) NOT NULL,  -- Amount before coupon
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'thb',
    
    -- Coupon Info
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    
    payment_method VARCHAR(50) NOT NULL, -- 'free', 'stripe', 'qr_promptpay'
    transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- 3. COUPON USAGES (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
    user_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_payments_course ON public.payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON public.coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_profile_id);

-- Ensure enrollments has a unique constraint for atomic upserts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_student_course'
    ) THEN
        ALTER TABLE public.enrollments ADD CONSTRAINT unique_student_course UNIQUE (student_profile_id, course_id);
    END IF;
END $$;

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Coupons: Public read (active only), Admin all
CREATE POLICY "Coupons are viewable by everyone" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());

-- Payments: Own payments, Admin all
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT 
USING (user_profile_id = public.get_active_profile_id());
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- Coupon Usages: Own usages, Admin all
CREATE POLICY "Users can view own coupon usages" ON public.coupon_usages FOR SELECT 
USING (user_profile_id = public.get_active_profile_id());
CREATE POLICY "Admins manage coupon usages" ON public.coupon_usages FOR ALL USING (public.is_admin());

-- ============================================================================
-- 5. ATOMIC WIZARD TRANSACTION RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.process_wizard_transaction(
    p_course_id UUID,
    p_instructor_id UUID,
    p_slot_id UUID, -- instructor_availability_id
    p_date DATE,
    p_coupon_code TEXT DEFAULT NULL,
    p_payment_method TEXT DEFAULT 'free'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_course_price DECIMAL;
    v_course_total_hours NUMERIC;
    v_coupon_id UUID;
    v_discount DECIMAL := 0;
    v_final_price DECIMAL;
    v_payment_id UUID;
    v_enrollment_id UUID;
    v_booking_id UUID;
    v_user_usage_count INT;
    v_start_time TIME;
    v_end_time TIME;
    v_coupon RECORD;
BEGIN
    -- 1. Get current user
    v_user_id := public.get_active_profile_id();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- 2. Get course info
    SELECT price, total_hours INTO v_course_price, v_course_total_hours FROM public.courses WHERE id = p_course_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Course not found';
    END IF;

    -- 3. Check for existing Active Enrollment
    SELECT id INTO v_enrollment_id FROM public.enrollments 
    WHERE student_profile_id = v_user_id AND course_id = p_course_id AND status = 'active';

    -- 4. Logic: If enrollment exists, price is 0 (Free booking)
    IF v_enrollment_id IS NOT NULL THEN
        v_final_price := 0;
        v_discount := v_course_price;
    ELSE
        -- 5. Validate Coupon if provided
    IF p_coupon_code IS NOT NULL AND p_coupon_code <> '' THEN
        -- Lock coupon for concurrency using a single fetch
        SELECT * INTO v_coupon 
        FROM public.coupons 
        WHERE code = UPPER(p_coupon_code) AND is_active = true 
        AND (valid_until IS NULL OR valid_until > now())
        FOR UPDATE;

        IF v_coupon.id IS NULL THEN
            RAISE EXCEPTION 'Invalid or expired coupon';
        END IF;

        -- Global Limit Check
        IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
            RAISE EXCEPTION 'Coupon global usage limit reached';
        END IF;

        -- Per User Limit Check
        SELECT COUNT(*) INTO v_user_usage_count FROM public.coupon_usages 
        WHERE coupon_id = v_coupon.id AND user_profile_id = v_user_id;
        
        IF v_coupon.per_user_limit IS NOT NULL AND v_user_usage_count >= v_coupon.per_user_limit THEN
            RAISE EXCEPTION 'You have already reached the usage limit for this coupon';
        END IF;

        -- Calculate discount
        IF v_coupon.type = 'percentage' THEN
            v_discount := (v_course_price * v_coupon.discount_value) / 100;
            IF v_coupon.max_discount_amount IS NOT NULL AND v_discount > v_coupon.max_discount_amount THEN
                v_discount := v_coupon.max_discount_amount;
            END IF;
        ELSE
            v_discount := v_coupon.discount_value;
        END IF;
        
        -- Cap discount to course price
        IF v_discount > v_course_price THEN
            v_discount := v_course_price;
        END IF;
        
        v_coupon_id := v_coupon.id;
    END IF;

    v_final_price := v_course_price - v_discount;
    END IF;

    -- 4. Create Payment (Status succeeded immediately for 'free' or 100% discount)
    INSERT INTO public.payments (
        user_profile_id, course_id, amount, original_amount, discount_amount, 
        coupon_id, payment_method, status
    ) VALUES (
        v_user_id, p_course_id, v_final_price, v_course_price, v_discount,
        v_coupon_id, p_payment_method, CASE WHEN v_final_price = 0 THEN 'succeeded' ELSE 'pending' END
    ) RETURNING id INTO v_payment_id;

    -- 5. If Payment Succeeded (or Free), complete the flow
    IF v_final_price = 0 THEN
        -- Link Coupon Usage
        IF v_coupon_id IS NOT NULL THEN
            INSERT INTO public.coupon_usages (coupon_id, user_profile_id, payment_id, discount_applied)
            VALUES (v_coupon_id, v_user_id, v_payment_id, v_discount);
            
            UPDATE public.coupons SET usage_count = usage_count + 1 WHERE id = v_coupon_id;
        END IF;

        -- Upsert Enrollment using atomic logic
        INSERT INTO public.enrollments (student_profile_id, course_id, status, total_hours, used_hours)
        VALUES (v_user_id, p_course_id, 'active', v_course_total_hours, 1)
        ON CONFLICT (student_profile_id, course_id) 
        DO UPDATE SET status = 'active', 
                      used_hours = public.enrollments.used_hours + 1,
                      total_hours = v_course_total_hours -- Sync total hours
        RETURNING id INTO v_enrollment_id;
        
        -- Update payment with enrollment info
        UPDATE public.payments SET enrollment_id = v_enrollment_id WHERE id = v_payment_id;

        -- Get slot times
        SELECT start_time, end_time INTO v_start_time, v_end_time 
        FROM public.instructor_availabilities WHERE id = p_slot_id;
        
        -- Create Booking
        INSERT INTO public.bookings (
            student_profile_id, instructor_profile_id, course_id, enrollment_id,
            instructor_availability_id, scheduled_date, start_time, end_time, status
        ) VALUES (
            v_user_id, p_instructor_id, p_course_id, v_enrollment_id,
            p_slot_id, p_date, v_start_time, v_end_time, 'confirmed'
        ) RETURNING id INTO v_booking_id;
    END IF;

    RETURN jsonb_build_object(
        'payment_id', v_payment_id,
        'enrollment_id', v_enrollment_id,
        'booking_id', v_booking_id,
        'final_price', v_final_price,
        'status', CASE WHEN v_final_price = 0 THEN 'success' ELSE 'awaiting_payment' END
    );
END;
$$;

-- Fulfill Stripe Payment RPC (System use by Webhook)
CREATE OR REPLACE FUNCTION public.fulfill_stripe_payment(
    p_payment_id UUID,
    p_transaction_id TEXT, -- Stripe Session ID
    p_instructor_id UUID,
    p_slot_id UUID,
    p_scheduled_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payment RECORD;
    v_course RECORD;
    v_enrollment_id UUID;
    v_booking_id UUID;
    v_start_time TIME;
    v_end_time TIME;
BEGIN
    -- 1. Fetch and Lock Payment
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF v_payment.status = 'succeeded' THEN
        RETURN jsonb_build_object('status', 'already_fulfilled');
    END IF;

    -- 2. Fetch Course Info
    SELECT * INTO v_course FROM public.courses WHERE id = v_payment.course_id;

    -- 3. Update Payment Status
    UPDATE public.payments SET 
        status = 'succeeded',
        transaction_id = p_transaction_id,
        updated_at = now()
    WHERE id = p_payment_id;

    -- 4. If Coupon was used, log it and update count
    IF v_payment.coupon_id IS NOT NULL THEN
        -- Insert into usages if not already there (idempotency)
        INSERT INTO public.coupon_usages (coupon_id, user_profile_id, payment_id, discount_applied)
        VALUES (v_payment.coupon_id, v_payment.user_profile_id, p_payment_id, v_payment.discount_amount)
        ON CONFLICT DO NOTHING;
        
        UPDATE public.coupons SET usage_count = usage_count + 1 WHERE id = v_payment.coupon_id;
    END IF;

    -- 5. Upsert Enrollment
    INSERT INTO public.enrollments (student_profile_id, course_id, status, total_hours, used_hours)
    VALUES (v_payment.user_profile_id, v_payment.course_id, 'active', v_course.total_hours, 1)
    ON CONFLICT (student_profile_id, course_id) 
    DO UPDATE SET status = 'active', 
                  used_hours = public.enrollments.used_hours + 1,
                  total_hours = v_course.total_hours
    RETURNING id INTO v_enrollment_id;

    -- Update payment with enrollment link
    UPDATE public.payments SET enrollment_id = v_enrollment_id WHERE id = p_payment_id;

    -- 6. Create Booking
    SELECT start_time, end_time INTO v_start_time, v_end_time 
    FROM public.instructor_availabilities WHERE id = p_slot_id;

    INSERT INTO public.bookings (
        student_profile_id, instructor_profile_id, course_id, enrollment_id,
        instructor_availability_id, scheduled_date, start_time, end_time, status
    ) VALUES (
        v_payment.user_profile_id, p_instructor_id, v_payment.course_id, v_enrollment_id,
        p_slot_id, p_scheduled_date, v_start_time, v_end_time, 'confirmed'
    ) RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object(
        'payment_id', p_payment_id,
        'enrollment_id', v_enrollment_id,
        'booking_id', v_booking_id,
        'status', 'fulfilled'
    );
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER handle_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER handle_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
