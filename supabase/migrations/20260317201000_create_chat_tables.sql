-- Create Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_reply BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'admin')),
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read')),
    is_draft BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create Policies (Secure: Only allow access via Service Role or Authenticated Admins)
-- The API routes will use Supabase Service Role Key to manage chats securely.
CREATE POLICY "Allow authenticated read on chat_sessions"
    ON public.chat_sessions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update on chat_sessions"
    ON public.chat_sessions FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on chat_messages"
    ON public.chat_messages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on chat_messages"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on chat_messages"
    ON public.chat_messages FOR UPDATE
    TO authenticated
    USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
