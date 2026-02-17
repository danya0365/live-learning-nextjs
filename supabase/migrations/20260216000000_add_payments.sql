-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'thb',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT payments_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own payments via booking
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.profiles p ON b.student_profile_id = p.id
        WHERE b.id = payments.booking_id
        AND p.auth_id = auth.uid()
    )
);

-- 2. Instructors can view payments for their courses
CREATE POLICY "Instructors can view payments for their bookings" 
ON public.payments FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.instructor_profiles ip ON b.instructor_profile_id = ip.id
        JOIN public.profiles p ON ip.profile_id = p.id
        WHERE b.id = payments.booking_id
        AND p.auth_id = auth.uid()
    )
);

-- 3. Service role can do everything
CREATE POLICY "Service role full access" 
ON public.payments FOR ALL 
USING ( auth.jwt() ->> 'role' = 'service_role' )
WITH CHECK ( auth.jwt() ->> 'role' = 'service_role' );

-- Update timestamp trigger (custom function to avoid extension dependency issues)
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
