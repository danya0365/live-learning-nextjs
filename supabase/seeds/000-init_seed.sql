-- Live Learning Seed Data — Init Single Super User
-- Created: 2026-02-14
-- Description: Single user with ALL roles (Admin, Instructor, Student) to simplify development

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set app password for testing
SET session my.app_password = '12345678';

-- ============================================================================
-- AUTH USERS (Only 1 User)
-- ============================================================================
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
  -- Super Admin User
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'admin@livelearning.com',
    crypt(current_setting('my.app_password'), gen_salt('bf')),
    NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"admin","full_name":"Super Admin","role":"admin","is_active":true}',
    NOW(), NOW(),
    '', '', '', ''
  );

-- ============================================================================
-- AUTH IDENTITIES
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
-- PROFILES
-- ============================================================================
-- Update the auto-created profile (from trigger) with fixed ID and Data
UPDATE public.profiles SET
  id = '10000000-0000-0000-0000-000000000001',
  username = 'admin',
  full_name = 'Super Admin',
  avatar_url = '�',
  bio = 'I am the Super Admin, capable of everything.'
WHERE auth_id = '00000000-0000-0000-0000-000000000001';

-- ============================================================================
-- ASSIGN ROLES (ALL ROLES)
-- ============================================================================
-- First, ensure the profile exists (trigger might be async in some environments, but here synchronous usually)
-- We insert roles. If conflicting with default 'student' role, we handle it.

-- Remove any default roles first to be clean
DELETE FROM public.profile_roles WHERE profile_id = '10000000-0000-0000-0000-000000000001';

-- Insert ALL roles
INSERT INTO public.profile_roles (profile_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', 'admin'),
  ('10000000-0000-0000-0000-000000000001', 'instructor'),
  ('10000000-0000-0000-0000-000000000001', 'student');
