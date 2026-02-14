-- Live Learning — Consultation Requests & Offers
-- Created: 2026-02-13
-- Author: Marosdee Uma
-- Description: Students post help requests, instructors submit offers

-- ============================================================================
-- 1. CONSULTATION REQUESTS — คำขอปรึกษาจากนักเรียน
-- ============================================================================
CREATE TYPE public.consultation_request_status AS ENUM ('open', 'in_progress', 'closed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  student_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),

  -- Budget
  budget_min INTEGER NOT NULL DEFAULT 0,
  budget_max INTEGER NOT NULL DEFAULT 0,

  -- Preferred schedule (JSONB for flexibility)
  preferred_dates JSONB DEFAULT '[]',   -- e.g. ["2026-03-15","2026-03-16"]
  preferred_times JSONB DEFAULT '[]',   -- e.g. [{"start":"09:00","end":"12:00"}]

  -- Status & stats
  status public.consultation_request_status NOT NULL DEFAULT 'open',
  offers_count INTEGER NOT NULL DEFAULT 0,
  accepted_offer_id UUID,               -- filled when student accepts an offer

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_student ON public.consultation_requests(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_category ON public.consultation_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests(status);

-- ============================================================================
-- 2. CONSULTATION OFFERS — ข้อเสนอจากอาจารย์
-- ============================================================================
CREATE TYPE public.consultation_offer_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE IF NOT EXISTS public.consultation_offers (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  request_id UUID REFERENCES public.consultation_requests(id) ON DELETE CASCADE NOT NULL,
  instructor_profile_id UUID REFERENCES public.instructor_profiles(id) ON DELETE CASCADE NOT NULL,

  message TEXT DEFAULT '',
  offered_price INTEGER NOT NULL DEFAULT 0,
  offered_date DATE NOT NULL,
  offered_start_time TIME NOT NULL,
  offered_end_time TIME NOT NULL,

  status public.consultation_offer_status NOT NULL DEFAULT 'pending',

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One offer per instructor per request
  UNIQUE(request_id, instructor_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_consultation_offers_request ON public.consultation_offers(request_id);
CREATE INDEX IF NOT EXISTS idx_consultation_offers_instructor ON public.consultation_offers(instructor_profile_id);
CREATE INDEX IF NOT EXISTS idx_consultation_offers_status ON public.consultation_offers(status);

-- Add FK from requests → accepted offer (deferred because offers table created after requests)
ALTER TABLE public.consultation_requests
  ADD CONSTRAINT fk_accepted_offer
  FOREIGN KEY (accepted_offer_id) REFERENCES public.consultation_offers(id) ON DELETE SET NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_offers_updated_at
  BEFORE UPDATE ON public.consultation_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment offers_count when new offer is inserted
CREATE OR REPLACE FUNCTION public.increment_offers_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.consultation_requests
  SET offers_count = offers_count + 1
  WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_consultation_offer_insert
  AFTER INSERT ON public.consultation_offers
  FOR EACH ROW EXECUTE FUNCTION public.increment_offers_count();

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_offers ENABLE ROW LEVEL SECURITY;

-- Requests: everyone can READ open requests, students manage own, admin manages all
CREATE POLICY "Open consultation requests are viewable by everyone"
  ON public.consultation_requests FOR SELECT
  USING (status = 'open' OR student_profile_id = public.get_active_profile_id() OR public.is_admin());

CREATE POLICY "Students can create consultation requests"
  ON public.consultation_requests FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND student_profile_id = public.get_active_profile_id()
  );

CREATE POLICY "Students can update their own requests"
  ON public.consultation_requests FOR UPDATE
  USING (student_profile_id = public.get_active_profile_id())
  WITH CHECK (student_profile_id = public.get_active_profile_id());

CREATE POLICY "Admins can manage all consultation requests"
  ON public.consultation_requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Offers: students see offers on own requests, instructors manage own offers
CREATE POLICY "Students can view offers on their requests"
  ON public.consultation_offers FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM public.consultation_requests
      WHERE student_profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Instructors can view their own offers"
  ON public.consultation_offers FOR SELECT
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles
      WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Instructors can create offers"
  ON public.consultation_offers FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles
      WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Instructors can update their own offers"
  ON public.consultation_offers FOR UPDATE
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles
      WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Admins can manage all offers"
  ON public.consultation_offers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
