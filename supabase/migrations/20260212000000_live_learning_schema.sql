-- Live Learning Domain Tables
-- Created: 2026-02-12
-- Author: Marosdee Uma
-- Description: Categories, Instructors, Courses, Time Slots, Bookings, Live Sessions
--              All business tables FK to profiles.id (not auth.users.id)

-- ============================================================================
-- 1. CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '📁',
  description TEXT DEFAULT '',
  color TEXT DEFAULT 'hsl(200, 60%, 50%)',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- ============================================================================
-- 2. INSTRUCTOR PROFILES (extends profiles for instructor-specific data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Professional info
  title TEXT DEFAULT '',               -- e.g. "อ.", "ดร."
  specializations TEXT[] DEFAULT '{}', -- e.g. {"React", "Node.js"}
  bio TEXT DEFAULT '',
  
  -- Stats
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  total_students INTEGER NOT NULL DEFAULT 0,
  total_courses INTEGER NOT NULL DEFAULT 0,
  hourly_rate INTEGER NOT NULL DEFAULT 0,    -- THB
  
  -- Availability
  languages TEXT[] DEFAULT '{"ไทย"}',
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  is_accepting_students BOOLEAN NOT NULL DEFAULT TRUE,
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instructor_profiles_profile_id ON public.instructor_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_is_active ON public.instructor_profiles(is_active);

-- ============================================================================
-- 3. COURSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  instructor_profile_id UUID REFERENCES public.instructor_profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  
  -- Pricing
  price INTEGER NOT NULL DEFAULT 0,       -- THB
  original_price INTEGER DEFAULT NULL,     -- for showing discount
  
  -- Stats
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  total_students INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  
  -- Media
  thumbnail_url TEXT DEFAULT '',
  
  -- Metadata
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_profile_id ON public.courses(instructor_profile_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON public.courses(is_featured);

-- ============================================================================
-- 4. TIME SLOTS (instructor availability)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  instructor_profile_id UUID REFERENCES public.instructor_profiles(id) ON DELETE CASCADE NOT NULL,
  
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),  -- 0=Sun, 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Booking status
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  booked_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_slots_instructor ON public.time_slots(instructor_profile_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON public.time_slots(day_of_week);

-- ============================================================================
-- 5. BOOKINGS
-- ============================================================================
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  student_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  instructor_profile_id UUID REFERENCES public.instructor_profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE SET NULL,
  
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_instructor ON public.bookings(instructor_profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_course ON public.bookings(course_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(scheduled_date);

-- ============================================================================
-- 6. LIVE SESSIONS
-- ============================================================================
CREATE TYPE public.live_session_status AS ENUM ('scheduled', 'live', 'ended');

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  instructor_profile_id UUID REFERENCES public.instructor_profiles(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  
  status public.live_session_status NOT NULL DEFAULT 'scheduled',
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  viewer_count INTEGER NOT NULL DEFAULT 0,
  max_viewers INTEGER NOT NULL DEFAULT 0,
  
  -- Room config
  room_url TEXT DEFAULT '',
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_course ON public.live_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_instructor ON public.live_sessions(instructor_profile_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON public.live_sessions(status);

-- ============================================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================================
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_profiles_updated_at
  BEFORE UPDATE ON public.instructor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
  BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_sessions_updated_at
  BEFORE UPDATE ON public.live_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS: Enable Row Level Security
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Categories: public read, admin write
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Instructor profiles: public read, own profile + admin write
CREATE POLICY "Instructor profiles are viewable by everyone"
  ON public.instructor_profiles FOR SELECT USING (true);

CREATE POLICY "Instructors can update their own profile"
  ON public.instructor_profiles FOR UPDATE
  USING (profile_id = public.get_active_profile_id())
  WITH CHECK (profile_id = public.get_active_profile_id());

CREATE POLICY "Admins can manage instructor profiles"
  ON public.instructor_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Courses: public read, instructor (own) + admin write
CREATE POLICY "Courses are viewable by everyone"
  ON public.courses FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their own courses"
  ON public.courses FOR ALL
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  )
  WITH CHECK (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Time slots: public read, instructor (own) + admin write
CREATE POLICY "Time slots are viewable by everyone"
  ON public.time_slots FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their own time slots"
  ON public.time_slots FOR ALL
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  )
  WITH CHECK (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Admins can manage all time slots"
  ON public.time_slots FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Bookings: students see own, instructors see their bookings, admin sees all
CREATE POLICY "Students can view their own bookings"
  ON public.bookings FOR SELECT
  USING (student_profile_id = public.get_active_profile_id());

CREATE POLICY "Instructors can view bookings for their classes"
  ON public.bookings FOR SELECT
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Students can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND student_profile_id = public.get_active_profile_id()
  );

CREATE POLICY "Students can cancel their own bookings"
  ON public.bookings FOR UPDATE
  USING (student_profile_id = public.get_active_profile_id())
  WITH CHECK (student_profile_id = public.get_active_profile_id());

CREATE POLICY "Instructors can update booking status"
  ON public.bookings FOR UPDATE
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Live sessions: public read, instructor (own) + admin write
CREATE POLICY "Live sessions are viewable by everyone"
  ON public.live_sessions FOR SELECT USING (true);

CREATE POLICY "Instructors can manage their own live sessions"
  ON public.live_sessions FOR ALL
  USING (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  )
  WITH CHECK (
    instructor_profile_id IN (
      SELECT id FROM public.instructor_profiles WHERE profile_id = public.get_active_profile_id()
    )
  );

CREATE POLICY "Admins can manage all live sessions"
  ON public.live_sessions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
