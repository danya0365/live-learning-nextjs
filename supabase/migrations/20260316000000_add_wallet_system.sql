-- 1. Create wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Policies for wallets
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (profile_id = public.get_active_profile_id());
CREATE POLICY "Admins can manage all wallets" ON public.wallets FOR ALL USING (public.is_admin());

-- 2. Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL, -- Positive for top-up/refund, negative for purchase
    type VARCHAR(50) NOT NULL CHECK (type IN ('topup', 'purchase', 'refund', 'withdrawal')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_type VARCHAR(100), -- What this transaction relates to (e.g., 'payment', 'stripe_session_id', 'refund_request')
    reference_id UUID, -- Optional ID linking to another table like payments
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for wallet_transactions
CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.wallets w
        WHERE w.id = wallet_transactions.wallet_id AND w.profile_id = public.get_active_profile_id()
    )
);
CREATE POLICY "Admins can manage all wallet transactions" ON public.wallet_transactions FOR ALL USING (public.is_admin());

-- Setup updated_at triggers
CREATE TRIGGER handle_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER handle_wallet_transactions_updated_at BEFORE UPDATE ON public.wallet_transactions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Function to handle auto-updating wallet balance when a transaction is completed
CREATE OR REPLACE FUNCTION public.update_wallet_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act if the status changed to 'completed' or a completed transaction is inserted
    IF (TG_OP = 'INSERT' AND NEW.status = 'completed') OR (TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed') THEN
        UPDATE public.wallets
        SET balance = balance + NEW.amount
        WHERE id = NEW.wallet_id;
    END IF;
    
    -- Handle case if a completed transaction is cancelled/failed (revert balance)
    IF (TG_OP = 'UPDATE' AND OLD.status = 'completed' AND NEW.status IN ('cancelled', 'failed')) THEN
        UPDATE public.wallets
        SET balance = balance - OLD.amount
        WHERE id = NEW.wallet_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_wallet_balance
AFTER INSERT OR UPDATE ON public.wallet_transactions
FOR EACH ROW EXECUTE PROCEDURE public.update_wallet_balance_on_transaction();


-- Function to explicitly top up or refund to wallet
CREATE OR REPLACE FUNCTION public.credit_wallet(
    p_profile_id UUID,
    p_amount NUMERIC,
    p_type VARCHAR DEFAULT 'topup', -- 'topup' or 'refund'
    p_reference_type VARCHAR DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT 'Top-up'
) RETURNS UUID AS $$
DECLARE
    v_wallet_id UUID;
    v_transaction_id UUID;
BEGIN
    -- Ensure amount is positive
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Credit amount must be greater than 0';
    END IF;

    -- Validate type
    IF p_type NOT IN ('topup', 'refund') THEN
        RAISE EXCEPTION 'Invalid credit type. Must be topup or refund';
    END IF;

    -- Get or create wallet
    SELECT id INTO v_wallet_id FROM public.wallets WHERE profile_id = p_profile_id FOR UPDATE;
    
    IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (profile_id, balance) 
        VALUES (p_profile_id, 0) 
        RETURNING id INTO v_wallet_id;
    END IF;

    -- Create completed transaction (this will trigger the balance update)
    INSERT INTO public.wallet_transactions (wallet_id, amount, type, status, reference_type, reference_id, description)
    VALUES (v_wallet_id, p_amount, p_type, 'completed', p_reference_type, p_reference_id, p_description)
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to pay with wallet
CREATE OR REPLACE FUNCTION public.pay_with_wallet(
    p_profile_id UUID,
    p_amount NUMERIC,
    p_reference_type VARCHAR DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT 'Wallet payment'
) RETURNS UUID AS $$
DECLARE
    v_wallet_id UUID;
    v_balance NUMERIC;
    v_transaction_id UUID;
BEGIN
    -- Amount should be passed as positive, but we will deduct it
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Payment amount must be greater than 0';
    END IF;

    -- Lock the wallet row to prevent race conditions
    SELECT id, balance INTO v_wallet_id, v_balance 
    FROM public.wallets 
    WHERE profile_id = p_profile_id 
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found';
    END IF;

    IF v_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- Insert negative transaction
    INSERT INTO public.wallet_transactions (wallet_id, amount, type, status, reference_type, reference_id, description)
    VALUES (v_wallet_id, -p_amount, 'purchase', 'completed', p_reference_type, p_reference_id, p_description)
    RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
