-- Live Learning Seed Data — Master Data (Environment Agnostic)
-- Created: 2026-02-14
-- Description: Critical data required for the application to function (Categories)

-- ============================================================================
-- 1. MASTER DATA: CATEGORIES
-- ============================================================================
INSERT INTO public.categories (id, name, slug, icon, description, color, sort_order, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Web Development', 'web-development', '🌐', 'Frontend & Backend', 'hsl(210, 80%, 60%)', 1, TRUE),
  ('20000000-0000-0000-0000-000000000002', 'Data Science & AI', 'data-science-ai', '🤖', 'AI & Machine Learning', 'hsl(280, 70%, 60%)', 2, TRUE),
  ('20000000-0000-0000-0000-000000000003', 'Design', 'design', '🎨', 'UX/UI & Graphic Design', 'hsl(330, 80%, 60%)', 3, TRUE),
  ('20000000-0000-0000-0000-000000000004', 'Mobile Development', 'mobile-development', '📱', 'iOS, Android & Flutter', 'hsl(150, 70%, 50%)', 4, TRUE),
  ('20000000-0000-0000-0000-000000000005', 'Cybersecurity', 'cybersecurity', '🛡️', 'Ethical Hacking', 'hsl(0, 70%, 55%)', 5, TRUE),
  ('20000000-0000-0000-0000-000000000006', 'DevOps & Cloud', 'devops-cloud', '☁️', 'Docker & Kubernetes', 'hsl(45, 90%, 55%)', 6, TRUE),
  ('20000000-0000-0000-0000-000000000007', 'Game Development', 'game-development', '🎮', 'Unity, Unreal, Godot & WebGL', 'hsl(260, 80%, 65%)', 7, TRUE),
  ('20000000-0000-0000-0000-000000000008', 'Tools & Productivity', 'tools-productivity', '⚡', 'VS Code, Git, Docker, & Productivity', 'hsl(30, 90%, 60%)', 8, TRUE),
  ('20000000-0000-0000-0000-000000000009', 'Career & Business', 'career-business', '💼', 'Freelancing, SaaS, & Soft Skills', 'hsl(200, 30%, 40%)', 9, TRUE),
  ('20000000-0000-0000-0000-000000000010', 'No-Code & Automation', 'no-code-automation', '⚡', 'Bubble, Zapier, Webflow', 'hsl(280, 80%, 70%)', 10, TRUE)
ON CONFLICT (id) DO NOTHING;
