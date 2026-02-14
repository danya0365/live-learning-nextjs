-- Live Learning Seed Data — Starter Content (Real Courses)
-- Created: 2026-02-14
-- Description: Initial real courses offered by the platform owner (Admin)
--              These are NOT mock data, but actual starter content.

-- ============================================================================
-- 1. INSTRUCTOR PROFILE (Super Admin)
-- ============================================================================
-- Ensure the admin has an instructor profile to own these courses
INSERT INTO public.instructor_profiles (id, profile_id, title, specializations, bio, rating, total_students, total_courses, hourly_rate, languages, is_online, is_active)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',           -- Instructor Profile ID
    '10000000-0000-0000-0000-000000000001',           -- Profile ID (Super Admin)
    'Lead Instructor',                                -- Title
    '{"Full-stack", "Game Dev", "Mobile"}',           -- Specializations
    'Main instructor for Live Learning platform, specializing in modern web and game development.', -- Bio
    5.00,                                             -- Rating
    0,                                                -- Total Students (Initial)
    0,                                                -- Total Courses (Initial)
    2000,                                             -- Hourly Rate
    '{"English", "Thai"}',                            -- Languages
    TRUE,                                             -- Is Online
    TRUE                                              -- Is Active
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. STARTER COURSES
-- ============================================================================
INSERT INTO public.courses (id, instructor_profile_id, category_id, title, slug, description, price, original_price, rating, total_students, total_reviews, total_hours, total_lessons, level, tags, is_live, is_featured, is_active)
VALUES
  -- 1. Laravel (Web Dev)
  (
    '40000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000001', -- Admin
    '20000000-0000-0000-0000-000000000001', -- Category: Web Dev
    'Modern Web Development with Laravel',
    'laravel-modern-web',
    'Build robust web applications using Laravel framework, exploring MVC, Eloquent ORM, and API development.',
    2500, 3500, 5.00, 0, 0, 30, 45,
    'intermediate', '{"Laravel", "PHP", "Backend"}',
    TRUE, TRUE, TRUE
  ),
  -- 2. Next.js (Web Dev)
  (
    '40000000-0000-0000-0000-000000000102',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001', -- Web Dev
    'Next.js 14 Fullstack Masterclass',
    'nextjs-fullstack',
    'Master Server Components, App Router, and Server Actions to build high-performance React applications.',
    3000, 4500, 5.00, 0, 0, 35, 50,
    'advanced', '{"Next.js", "React", "Fullstack"}',
    TRUE, TRUE, TRUE
  ),
  -- 3. NestJS (Web Dev)
  (
    '40000000-0000-0000-0000-000000000103',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001', -- Web Dev
    'Scalable Backend with NestJS',
    'nestjs-backend',
    'Enterprise-grade backend development with NestJS, TypeScript, and Microservices architecture.',
    2800, 3800, 5.00, 0, 0, 28, 40,
    'advanced', '{"NestJS", "Node.js", "TypeScript"}',
    FALSE, FALSE, TRUE
  ),
  -- 4. React Native (Mobile)
  (
    '40000000-0000-0000-0000-000000000104',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004', -- Mobile
    'React Native Mobile App Development',
    'react-native-mobile',
    'Build cross-platform mobile apps for iOS and Android using React Native and Expo.',
    2200, 3000, 5.00, 0, 0, 25, 35,
    'intermediate', '{"React Native", "Mobile", "iOS", "Android"}',
    TRUE, FALSE, TRUE
  ),
  -- 5. Phaser (Game Dev)
  (
    '40000000-0000-0000-0000-000000000105',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000007', -- Game Dev
    '2D Game Development with Phaser.js',
    'phaser-game-dev',
    'Create engaging 2D browser games using JavaScript and the Phaser framework.',
    1800, 2500, 5.00, 0, 0, 20, 30,
    'beginner', '{"Phaser", "Game Dev", "JavaScript"}',
    FALSE, TRUE, TRUE
  ),
  -- 6. React Three Fiber (Game Dev / Web Dev)
  (
    '40000000-0000-0000-0000-000000000106',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000007', -- Game Dev (or Web Dev)
    '3D Web Experiences with React Three Fiber',
    'react-three-fiber',
    'Bring 3D graphics to the web using React Three Fiber and Three.js.',
    2600, 3600, 5.00, 0, 0, 22, 32,
    'advanced', '{"Three.js", "React", "3D", "WebGL"}',
    TRUE, TRUE, TRUE
  ),
  -- 7. Godot (Game Dev)
  (
    '40000000-0000-0000-0000-000000000107',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000007', -- Game Dev
    'Indie Game Development with Godot 4',
    'godot-game-dev',
    'Learn GDScript and build your first 2D/3D game with the open-source Godot Engine.',
    1500, 2200, 5.00, 0, 0, 24, 36,
    'beginner', '{"Godot", "Game Dev", "GDScript"}',
    FALSE, TRUE, TRUE
  )
ON CONFLICT (id) DO NOTHING;
