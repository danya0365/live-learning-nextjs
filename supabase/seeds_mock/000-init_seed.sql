-- Live Learning Seed Data — Init Users + Profiles
-- Created: 2026-02-12
-- Author: Marosdee Uma
-- Description: Core auth users, profiles, and role assignments for Live Learning

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set app password for testing
SET session my.app_password = '12345678';

-- ============================================================================
-- AUTH USERS
-- ============================================================================
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
  -- Admin
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'admin@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '90 days', NOW() - INTERVAL '1 day',
    '{"provider":"email","providers":["email"]}',
    '{"username":"admin","full_name":"Admin","role":"admin","is_active":true}',
    NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days',
    '', '', '', ''
  ),
  -- Instructor 1: อ.สมชาย
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000010',
    'authenticated', 'authenticated',
    'somchai@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '60 days', NOW() - INTERVAL '2 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"somchai","full_name":"อ.สมชาย พัฒนาเว็บ","role":"instructor","is_active":true}',
    NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days',
    '', '', '', ''
  ),
  -- Instructor 2: ดร.นภา
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000011',
    'authenticated', 'authenticated',
    'napa@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '50 days', NOW() - INTERVAL '3 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"napa","full_name":"ดร.นภา AI วิจัย","role":"instructor","is_active":true}',
    NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days',
    '', '', '', ''
  ),
  -- Instructor 3: อ.พิมพ์ลดา
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000012',
    'authenticated', 'authenticated',
    'pimlada@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '45 days', NOW() - INTERVAL '1 day',
    '{"provider":"email","providers":["email"]}',
    '{"username":"pimlada","full_name":"อ.พิมพ์ลดา ดีไซน์","role":"instructor","is_active":true}',
    NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days',
    '', '', '', ''
  ),
  -- Instructor 4: อ.ธนกร
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000013',
    'authenticated', 'authenticated',
    'thanakorn@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '40 days', NOW() - INTERVAL '4 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"thanakorn","full_name":"อ.ธนกร โมบาย","role":"instructor","is_active":true}',
    NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days',
    '', '', '', ''
  ),
  -- Instructor 5: อ.วีรภัทร
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000014',
    'authenticated', 'authenticated',
    'weerapat@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"weerapat","full_name":"อ.วีรภัทร ไซเบอร์","role":"instructor","is_active":true}',
    NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days',
    '', '', '', ''
  ),
  -- Student 1: น้องมิน
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000020',
    'authenticated', 'authenticated',
    'min@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day',
    '{"provider":"email","providers":["email"]}',
    '{"username":"min","full_name":"น้องมิน","role":"student","is_active":true}',
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days',
    '', '', '', ''
  ),
  -- Student 2: น้องเบล
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000021',
    'authenticated', 'authenticated',
    'bel@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"bel","full_name":"น้องเบล","role":"student","is_active":true}',
    NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days',
    '', '', '', ''
  ),
  -- Student 3: น้องบอส
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000022',
    'authenticated', 'authenticated',
    'boss@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '20 days', NOW() - INTERVAL '3 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"boss","full_name":"น้องบอส","role":"student","is_active":true}',
    NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days',
    '', '', '', ''
  ),
  -- Student 4: น้องฟ้า
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000023',
    'authenticated', 'authenticated',
    'fa@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '4 days',
    '{"provider":"email","providers":["email"]}',
    '{"username":"fa","full_name":"น้องฟ้า","role":"student","is_active":true}',
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days',
    '', '', '', ''
  );

-- ============================================================================
-- AUTH IDENTITIES (required for Supabase Auth to work)
-- ============================================================================
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
SELECT
  extensions.uuid_generate_v4(),
  id, id,
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  'email',
  last_sign_in_at, created_at, updated_at
FROM auth.users
ON CONFLICT (provider_id, provider) DO NOTHING;

-- ============================================================================
-- PROFILES (auto-created by trigger, but we override with specific IDs)
-- Note: The on_auth_user_created trigger already created profiles,
--       so we UPDATE them with our desired data instead
-- ============================================================================
-- First, update the auto-created profiles with our desired profile IDs and data
-- Admin
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000001',
  username = 'admin',
  full_name = 'Admin',
  avatar_url = '🛡️'
WHERE auth_id = '00000000-0000-0000-0000-000000000001';

-- อ.สมชาย
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000010',
  username = 'somchai',
  full_name = 'อ.สมชาย พัฒนาเว็บ',
  avatar_url = '👨‍🏫'
WHERE auth_id = '00000000-0000-0000-0000-000000000010';

-- ดร.นภา
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000011',
  username = 'napa',
  full_name = 'ดร.นภา AI วิจัย',
  avatar_url = '👩‍🔬'
WHERE auth_id = '00000000-0000-0000-0000-000000000011';

-- อ.พิมพ์ลดา
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000012',
  username = 'pimlada',
  full_name = 'อ.พิมพ์ลดา ดีไซน์',
  avatar_url = '👩‍🎨'
WHERE auth_id = '00000000-0000-0000-0000-000000000012';

-- อ.ธนกร
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000013',
  username = 'thanakorn',
  full_name = 'อ.ธนกร โมบาย',
  avatar_url = '👨‍💻'
WHERE auth_id = '00000000-0000-0000-0000-000000000013';

-- อ.วีรภัทร
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000014',
  username = 'weerapat',
  full_name = 'อ.วีรภัทร ไซเบอร์',
  avatar_url = '🕵️'
WHERE auth_id = '00000000-0000-0000-0000-000000000014';

-- น้องมิน
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000020',
  username = 'min',
  full_name = 'น้องมิน',
  avatar_url = '🧑‍💻'
WHERE auth_id = '00000000-0000-0000-0000-000000000020';

-- น้องเบล
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000021',
  username = 'bel',
  full_name = 'น้องเบล',
  avatar_url = '👩‍🎓'
WHERE auth_id = '00000000-0000-0000-0000-000000000021';

-- น้องบอส
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000022',
  username = 'boss',
  full_name = 'น้องบอส',
  avatar_url = '🧑‍🎓'
WHERE auth_id = '00000000-0000-0000-0000-000000000022';

-- น้องฟ้า
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000023',
  username = 'fa',
  full_name = 'น้องฟ้า',
  avatar_url = '👧'
WHERE auth_id = '00000000-0000-0000-0000-000000000023';

-- ============================================================================
-- ASSIGN ROLES (override auto-created 'student' roles)
-- ============================================================================
-- Admin role
UPDATE public.profile_roles SET role = 'admin'::public.profile_role
WHERE profile_id = '10000000-0000-0000-0000-000000000001';

-- Instructor roles
UPDATE public.profile_roles SET role = 'instructor'::public.profile_role
WHERE profile_id IN (
  '10000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000013',
  '10000000-0000-0000-0000-000000000014'
);

-- Students keep default 'student' role — no update needed
