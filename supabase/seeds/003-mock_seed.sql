-- Live Learning Seed Data — Mock Domain Data (Linked to Super Admin)
-- Created: 2026-02-14
-- Description: Optional mock data for development: Instructor profile, Courses, Slots, Bookings

-- ============================================================================
-- 1. INSTRUCTOR PROFILE (Only 1: Super Admin)
-- ============================================================================
INSERT INTO public.instructor_profiles (id, profile_id, title, specializations, bio, rating, total_students, total_courses, hourly_rate, languages, is_online, is_active)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',           -- Instructor Profile ID
    '10000000-0000-0000-0000-000000000001',           -- Profile ID (Super Admin)
    'Prof.',                                          -- Title
    '{"Full-stack", "AI", "Mobile", "Security"}',    -- Specializations (Combined)
    'Super Instructor capable of teaching everything from Web Dev to AI and Cybersecurity.', -- Bio
    5.00,                                             -- Rating
    999,                                              -- Total Students
    6,                                                -- Total Courses
    2500,                                             -- Hourly Rate
    '{"English", "Thai"}',                            -- Languages
    TRUE,                                             -- Is Online
    TRUE                                              -- Is Active
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. COURSES (All linked to Super Admin)
-- ============================================================================
INSERT INTO public.courses (id, instructor_profile_id, category_id, title, slug, description, price, original_price, rating, total_students, total_reviews, total_hours, total_lessons, level, tags, is_live, is_featured, is_active)
VALUES
  -- Course 1: Web Dev
  (
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000001',
    'Advanced Full-stack Architecture',
    'advanced-fullstack',
    'Master microservices, serverless, and clean architecture patterns.',
    3500, 5000, 4.95, 150, 42, 40, 60,
    'advanced', '{"Microservices", "Docker", "Kubernetes"}',
    TRUE, TRUE, TRUE
  ),
  -- Course 2: AI
  (
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000002',
    'AI for Everyone: Zero to Hero',
    'ai-zero-hero',
    'Understand AI concepts and build your first models.',
    1500, 2500, 4.80, 80, 15, 20, 30,
    'beginner', '{"AI", "Python", "Basics"}',
    FALSE, TRUE, TRUE
  ),
  -- Course 3: UX/UI
  (
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000003',
    'UX/UI Design Masterclass',
    'uxui-masterclass',
    'Design beautiful interfaces with Figma and Adobe XD.',
    2000, 3000, 4.70, 60, 20, 25, 40,
    'intermediate', '{"UX", "UI", "Figma"}',
    TRUE, FALSE, TRUE
  ),
  -- Course 4: Mobile (Flutter)
  (
    '40000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000004',
    'Flutter Mobile App Development',
    'flutter-mobile',
    'Build cross-platform apps for iOS and Android.',
    1800, 2800, 4.85, 90, 35, 30, 50,
    'intermediate', '{"Flutter", "Dart", "Mobile"}',
    TRUE, TRUE, TRUE
  ),
  -- Course 5: Cybersecurity
  (
    '40000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000005',
    'Cybersecurity Fundamentals',
    'cyber-fundamentals',
    'Learn ethical hacking and network security.',
    2200, 3200, 4.90, 40, 10, 15, 25,
    'beginner', '{"Security", "Hacking", "Network"}',
    FALSE, FALSE, TRUE
  ),
  -- Course 6: DevOps
  (
    '40000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000001', -- Link to Super Admin
    '20000000-0000-0000-0000-000000000006',
    'DevOps CI/CD Pipeline',
    'devops-pipeline',
    'Automate your deployment with Jenkins and GitHub Actions.',
    3000, 4500, 4.75, 55, 18, 28, 45,
    'advanced', '{"DevOps", "CI/CD", "Automation"}',
    FALSE, FALSE, TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. TIME SLOTS (Availability for Super Admin)
-- ============================================================================
INSERT INTO public.time_slots (id, instructor_profile_id, day_of_week, start_time, end_time, is_booked, booked_course_id, is_active)
VALUES
  -- Monday
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 1, '09:00', '11:00', FALSE, NULL, TRUE),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 1, '13:00', '15:00', FALSE, NULL, TRUE),
  -- Wednesday
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 3, '10:00', '12:00', FALSE, NULL, TRUE),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 3, '14:00', '16:00', FALSE, NULL, TRUE),
  -- Friday
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 5, '09:00', '12:00', FALSE, NULL, TRUE),
  -- Saturday (Weekend Class)
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 6, '13:00', '16:00', FALSE, NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. BOOKINGS (Self-booking strictly for demo purposes)
-- ============================================================================
INSERT INTO public.bookings (id, student_profile_id, instructor_profile_id, course_id, time_slot_id, scheduled_date, start_time, end_time, status, is_active)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001', -- Student: Super Admin
    '30000000-0000-0000-0000-000000000001', -- Instructor: Super Admin
    '40000000-0000-0000-0000-000000000001', -- Course: Advanced Full-stack
    NULL,                                   -- No slot ID (Ad-hoc or ancient booking)
    '2026-03-20', '10:00', '12:00',
    'confirmed', TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. LIVE SESSIONS
-- ============================================================================
INSERT INTO public.live_sessions (id, course_id, instructor_profile_id, title, description, status, scheduled_start, scheduled_end, viewer_count, max_viewers, is_active)
VALUES
  (
    '70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'System Architecture Q&A',
    'Live discussion on distributed systems.',
    'scheduled',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day 2 hours',
    0, 0,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;
