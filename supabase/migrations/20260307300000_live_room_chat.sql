-- Live Room Chat and Participants
-- Created: 2026-03-07
-- Description: Tables for persisting live room chat and tracking participants

-- 1. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  text TEXT NOT NULL,
  is_instructor BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_chat_messages_session ON public.live_chat_messages(live_session_id);
CREATE INDEX IF NOT EXISTS idx_live_chat_messages_created_at ON public.live_chat_messages(created_at);

-- 2. LIVE SESSION PARTICIPANTS (for persistence if needed, though Presence is primary)
CREATE TABLE IF NOT EXISTS public.live_session_participants (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  
  -- One entry per user per session (can be updated with left_at)
  UNIQUE (live_session_id, profile_id, joined_at)
);

CREATE INDEX IF NOT EXISTS idx_live_session_participants_session ON public.live_session_participants(live_session_id);

-- 3. ENABLE RLS
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_session_participants ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
-- Chat: Everyone can read, authenticated can insert
CREATE POLICY "Chat messages are viewable by everyone"
  ON public.live_chat_messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send chat messages"
  ON public.live_chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Participants: Everyone can read, own record insert/update
CREATE POLICY "Participants are viewable by everyone"
  ON public.live_session_participants FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join sessions"
  ON public.live_session_participants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own join/leave status"
  ON public.live_session_participants FOR UPDATE
  USING (profile_id = public.get_active_profile_id());

-- 5. REALTIME
-- Enable Realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;
