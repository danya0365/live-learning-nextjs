-- ============================================================================
-- Content & Community Tables Migration
-- Created: 2026-03-07
-- Description: events, blog_posts, content_pages, faqs, feedback
-- ============================================================================

-- ============================================================================
-- 1. EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);

-- ============================================================================
-- 2. BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  body TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  published_at DATE,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  image_url TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);

-- ============================================================================
-- 3. CONTENT PAGES (terms, privacy, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_pages (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  last_updated TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON public.content_pages(slug);

-- ============================================================================
-- 4. FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON public.faqs(is_active);

-- ============================================================================
-- 5. FEEDBACK
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_profile_id ON public.feedback(profile_id);

-- ============================================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================================
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON public.content_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS: Enable Row Level Security
-- ============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Events: public read, admin write
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Only admins can manage events"
  ON public.events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Blog Posts: public read (published only), admin write
CREATE POLICY "Published blog posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (is_published = TRUE AND is_active = TRUE);

CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Content Pages: public read, admin write
CREATE POLICY "Content pages are viewable by everyone"
  ON public.content_pages FOR SELECT USING (true);

CREATE POLICY "Only admins can manage content pages"
  ON public.content_pages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- FAQs: public read (active only), admin write
CREATE POLICY "Active FAQs are viewable by everyone"
  ON public.faqs FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all FAQs"
  ON public.faqs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can manage FAQs"
  ON public.faqs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Feedback: authenticated users can create, admin can read/manage
CREATE POLICY "Authenticated users can create feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (profile_id = public.get_active_profile_id());

CREATE POLICY "Admins can manage all feedback"
  ON public.feedback FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Service role can manage feedback (for API routes)
CREATE POLICY "Service role can manage feedback"
  ON public.feedback FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed: Blog Posts
INSERT INTO public.blog_posts (id, title, slug, excerpt, category, author, published_at, read_time_minutes, image_url, is_published) VALUES
  (extensions.uuid_generate_v4(), '5 เทคนิคเรียนออนไลน์ให้เก่งขึ้น', '5-online-learning-tips', 'เรียนรู้เคล็ดลับในการจัดการเวลาและตั้งสมาธิให้พร้อมสำหรับการเรียนสดออนไลน์', 'เคล็ดลับการเรียน', 'Admin', '2026-08-15', 5, 'linear-gradient(135deg, hsl(200 80% 60%), hsl(240 80% 60%))', TRUE),
  (extensions.uuid_generate_v4(), 'เริ่มต้นเขียนโค้ดภาษา Python ฉบับมือใหม่', 'python-for-beginners', 'คู่มือสำหรับผู้ที่อยากเริ่มต้นเป็นโปรแกรมเมอร์ด้วยภาษาที่ได้รับความนิยมที่สุดในโลก', 'Programming', 'Instructor Dave', '2026-08-12', 8, 'linear-gradient(135deg, hsl(50 80% 60%), hsl(30 80% 60%))', TRUE),
  (extensions.uuid_generate_v4(), 'ทำไม UX/UI Design ถึงสำคัญในปี 2025?', 'why-ux-ui-matters-2025', 'เจาะลึกเทรนด์การออกแบบและทำไมทุกธุรกิจต้องการ UX/UI Designer', 'Design', 'Jane Doe', '2026-08-10', 6, 'linear-gradient(135deg, hsl(320 80% 60%), hsl(280 80% 60%))', TRUE);

-- Seed: Content Pages
INSERT INTO public.content_pages (id, slug, title, body, last_updated) VALUES
  (extensions.uuid_generate_v4(), 'terms', '📜 ข้อกำหนดการใช้งาน',
   '<h3>1. บทนำ</h3><p>ยินดีต้อนรับสู่ Live Learning ("เรา", "พวกเรา", หรือ "ของเรา") การเข้าถึงและใช้งานเว็บไซต์ รวมถึงบริการต่างๆ ของเรา เป็นไปตามข้อตกลงและเงื่อนไขเหล่านี้</p><h3>2. บัญชีผู้ใช้</h3><p>คุณต้องรับผิดชอบในการรักษาความลับของบัญชีและรหัสผ่านของคุณ รวมถึงกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ</p><h3>3. การชำระเงินและการคืนเงิน</h3><p>การชำระเงินสำหรับคอร์สเรียนถือเป็นที่สิ้นสุด เว้นแต่จะระบุไว้เป็นอย่างอื่นในนโยบายการคืนเงินของเรา</p><h3>4. ทรัพย์สินทางปัญญา</h3><p>เนื้อหาทั้งหมดบนแพลตฟอร์มนี้ รวมถึงข้อความ กราฟิก โลโก้ และภาพ เป็นทรัพย์สินของเราหรือผู้ออกใบอนุญาตของเรา และได้รับความคุ้มครองตามกฎหมายลิขสิทธิ์</p><h3>5. การเปลี่ยนแปลงข้อกำหนด</h3><p>เราสงวนสิทธิ์ในการแก้ไขข้อกำหนดเหล่านี้ได้ตลอดเวลา โดยจะมีผลทันทีเมื่อประกาศบนเว็บไซต์</p>',
   '15 สิงหาคม 2568'),
  (extensions.uuid_generate_v4(), 'privacy', '🛡️ นโยบายความเป็นส่วนตัว',
   '<h3>1. การรวบรวมข้อมูล</h3><p>เราเก็บรวบรวมข้อมูลที่คุณให้โดยตรง เช่น ชื่อ อีเมล และข้อมูลการชำระเงิน เมื่อคุณลงทะเบียนบัญชีหรือซื้อคอร์สเรียน</p><h3>2. การใช้ข้อมูล</h3><p>เราใช้ข้อมูลของคุณเพื่อให้บริการ ประมวลผลธุรกรรม สื่อสารกับคุณ และปรับปรุงบริการของเรา รวมถึงการส่งข่าวสารและโปรโมชั่น (หากคุณยินยอม)</p><h3>3. การเปิดเผยข้อมูล</h3><p>เราไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด แต่เราอาจแบ่งปันข้อมูลกับผู้ให้บริการที่เชื่อถือได้ซึ่งช่วยเราดำเนินการเว็บไซต์</p><h3>4. การรักษาความปลอดภัย</h3><p>เราใช้มาตรการทางกายภาพ อิเล็กทรอนิกส์ และการจัดการที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต</p><h3>5. สิทธิ์ของคุณ</h3><p>คุณมีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ตลอดเวลา โดยติดต่อทีมงานช่วยเหลือของเรา</p>',
   '15 สิงหาคม 2568');

-- Seed: FAQs
INSERT INTO public.faqs (id, question, answer, category, is_active, sort_order) VALUES
  (extensions.uuid_generate_v4(), 'Live Learning คืออะไร?', 'Live Learning คือแพลตฟอร์มการเรียนรู้ออนไลน์ที่เน้นการเรียนสดกับอาจารย์ผู้เชี่ยวชาญ เพื่อให้ผู้เรียนสามารถโต้ตอบและสอบถามได้ทันที', 'ทั่วไป', TRUE, 1),
  (extensions.uuid_generate_v4(), 'ฉันจะสมัครเรียนได้อย่างไร?', 'คุณสามารถเลือกคอร์สที่สนใจ และกดปุ่ม "สมัครเรียน" หรือ "จองเวลาเรียน" จากหน้ารายละเอียดคอร์สได้เลย', 'การสมัครเรียน', TRUE, 2),
  (extensions.uuid_generate_v4(), 'มีค่าใช้จ่ายในการสมัครสมาชิกหรือไม่?', 'การสมัครสมาชิก Live Learning ไม่มีค่าใช้จ่าย คุณจะเสียค่าใช้จ่ายเฉพาะเมื่อลงทะเบียนเรียนในคอร์สเท่านั้น', 'การสมัครเรียน', TRUE, 3),
  (extensions.uuid_generate_v4(), 'ฉันสามารถขอคืนเงินได้หรือไม่?', 'เรามีนโยบายคืนเงินภายใน 7 วัน หากคุณไม่พอใจในการเรียนการสอน หรือมีเหตุผลอันสมควร', 'การชำระเงิน', TRUE, 4),
  (extensions.uuid_generate_v4(), 'เรียนผ่านอุปกรณ์ใดได้บ้าง?', 'รองรับการใช้งานผ่านคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน ทั้งระบบ iOS และ Android ผ่านเว็บเบราว์เซอร์', 'เทคนิค', TRUE, 5);
