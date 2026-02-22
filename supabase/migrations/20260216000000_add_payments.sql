-- Create payments table
-- Supports both enrollment-based payments (course purchase) and standalone booking payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'thb',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT payments_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own payments via enrollment or booking
CREATE POLICY "Users can view their own payments"
ON public.payments FOR SELECT
USING (
    -- Via enrollment
    EXISTS (
        SELECT 1 FROM public.enrollments e
        WHERE e.id = payments.enrollment_id
        AND e.student_profile_id = public.get_active_profile_id()
    )
    OR
    -- Via booking
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = payments.booking_id
        AND b.student_profile_id = public.get_active_profile_id()
    )
);

-- 2. Instructors can view payments for their courses
CREATE POLICY "Instructors can view payments for their courses"
ON public.payments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.courses c ON e.course_id = c.id
        JOIN public.instructor_profiles ip ON c.instructor_profile_id = ip.id
        WHERE e.id = payments.enrollment_id
        AND ip.profile_id = public.get_active_profile_id()
    )
);

-- 3. Service role can do everything
CREATE POLICY "Service role full access"
ON public.payments FOR ALL
USING ( auth.jwt() ->> 'role' = 'service_role' )
WITH CHECK ( auth.jwt() ->> 'role' = 'service_role' );

-- 4. Admins can manage all payments
CREATE POLICY "Admins can manage all payments"
ON public.payments FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
