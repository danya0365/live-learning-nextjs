-- ============================================================================
-- Achievements Tables Migration
-- Created: 2026-03-07
-- Description: achievement_definitions (master list) + user_achievements (per-user progress)
-- ============================================================================

-- ============================================================================
-- 1. ACHIEVEMENT DEFINITIONS (master catalog of all achievements)
-- ============================================================================
CREATE TYPE public.achievement_category AS ENUM ('learning', 'consistency', 'social', 'milestone');

CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  icon TEXT NOT NULL DEFAULT '🏆',
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category public.achievement_category NOT NULL,
  max_progress INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievement_definitions_category ON public.achievement_definitions(category);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_is_active ON public.achievement_definitions(is_active);

-- ============================================================================
-- 2. USER ACHIEVEMENTS (per-user progress tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievement_definitions(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One entry per user per achievement
  UNIQUE (profile_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_profile ON public.user_achievements(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON public.user_achievements(unlocked_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_achievement_definitions_updated_at
  BEFORE UPDATE ON public.achievement_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievement definitions: public read, admin write
CREATE POLICY "Achievement definitions are viewable by everyone"
  ON public.achievement_definitions FOR SELECT USING (true);

CREATE POLICY "Only admins can manage achievement definitions"
  ON public.achievement_definitions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User achievements: users see own, admin sees all
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (profile_id = public.get_active_profile_id());

CREATE POLICY "Admins can view all user achievements"
  ON public.user_achievements FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Service role can manage user achievements"
  ON public.user_achievements FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admins can manage all user achievements"
  ON public.user_achievements FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- SEED DATA: 12 Achievement Definitions
-- ============================================================================
INSERT INTO public.achievement_definitions (id, icon, label, description, category, max_progress, sort_order) VALUES
  -- Learning (1-4)
  (extensions.uuid_generate_v4(), '🎯', 'เรียนครบ 10 ชม.', 'เรียนสะสมครบ 10 ชั่วโมง', 'learning', 10, 1),
  (extensions.uuid_generate_v4(), '📚', 'นักอ่านตัวยง', 'ลงทะเบียนเรียน 5 คอร์ส', 'learning', 5, 2),
  (extensions.uuid_generate_v4(), '🧠', 'เรียนรู้ไม่หยุด', 'เรียนครบ 50 ชั่วโมง', 'learning', 50, 3),
  (extensions.uuid_generate_v4(), '🎓', 'จบคอร์สแรก', 'เรียนจบคอร์สครบ 1 คอร์ส', 'learning', 1, 4),
  -- Consistency (5-7)
  (extensions.uuid_generate_v4(), '🔥', 'เข้าเรียน 7 วันติด', 'เข้าเรียนต่อเนื่อง 7 วันติดต่อกัน', 'consistency', 7, 5),
  (extensions.uuid_generate_v4(), '💪', 'เข้าเรียน 30 วันติด', 'เข้าเรียนต่อเนื่อง 30 วันติดต่อกัน', 'consistency', 30, 6),
  (extensions.uuid_generate_v4(), '⏰', 'ตรงเวลาเสมอ', 'เข้าเรียนตรงเวลา 10 ครั้ง', 'consistency', 10, 7),
  -- Social (8-9)
  (extensions.uuid_generate_v4(), '⭐', 'นักรีวิว', 'เขียนรีวิวคอร์สครบ 3 รีวิว', 'social', 3, 8),
  (extensions.uuid_generate_v4(), '🤝', 'ชวนเพื่อนมาเรียน', 'แนะนำเพื่อนสมัครเรียน 1 คน', 'social', 1, 9),
  -- Milestone (10-12)
  (extensions.uuid_generate_v4(), '🏆', 'Top Student', 'ได้คะแนนสูงสุดในคลาส', 'milestone', 1, 10),
  (extensions.uuid_generate_v4(), '💎', 'สมาชิก Premium', 'อัปเกรดเป็นสมาชิก Premium', 'milestone', 1, 11),
  (extensions.uuid_generate_v4(), '🚀', 'จบครบ 10 คอร์ส', 'เรียนจบครบ 10 คอร์ส', 'milestone', 10, 12);
