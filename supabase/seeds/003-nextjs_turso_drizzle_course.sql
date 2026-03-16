-- Live Learning Seed Data — Next.js + Turso + Drizzle ORM Course
-- Created: 2026-03-12
-- Description: คอร์สเต็มรูปแบบสำหรับผู้เริ่มต้น สอนสร้าง Full Stack Web App
--              ด้วย Next.js, Turso (LibSQL) และ Drizzle ORM ตั้งแต่ศูนย์
--              Language: Thai (Technical terms in English)

-- ============================================================================
-- 1. COURSE
-- ============================================================================
INSERT INTO public.courses (id, category_id, title, slug, description, price, original_price, rating, total_students, total_reviews, total_hours, total_lessons, level, tags, is_live_feature, is_featured, is_active)
VALUES
  (
    '40000000-0000-0000-0000-000000000140',   -- Course ID
    '20000000-0000-0000-0000-000000000001',   -- Category: Web Development
    'เขียน Full Stack Web อย่างง่ายด้วย Next.js + Turso + Drizzle ORM',
    'nextjs-turso-drizzle-fullstack',
    'คอร์สสำหรับมือใหม่สุดๆ ที่อยากสร้างเว็บแอปแบบ Full Stack ได้ด้วยตัวเอง! เรียนรู้ Next.js (App Router), Turso (SQLite บน Cloud) และ Drizzle ORM ตั้งแต่ติดตั้งจนถึง Deploy ขึ้น Production จริง ไม่ต้องมีพื้นฐานมาก่อน',
    2500,     -- Price (THB)
    4500,     -- Original Price
    5.00,     -- Rating
    0,        -- Total Students
    0,        -- Total Reviews
    20,       -- Total Hours
    65,       -- Total Lessons
    'beginner',
    '{"Next.js", "Turso", "Drizzle ORM", "Full Stack", "SQLite"}',
    TRUE,     -- Is Live Feature
    TRUE,     -- Is Featured
    TRUE      -- Is Active
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. INSTRUCTOR-COURSE ASSIGNMENT
-- ============================================================================
INSERT INTO public.instructor_courses (instructor_profile_id, course_id, is_primary)
VALUES
  ('30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000140', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. COURSE DETAILS (Learning Outcomes, Requirements, Syllabus, etc.)
-- ============================================================================
UPDATE public.courses
SET
  learning_outcomes = ARRAY[
    'เข้าใจหลักการ Full Stack Web Development ตั้งแต่ Frontend ถึง Backend',
    'สร้างโปรเจกต์ Next.js (App Router) จากศูนย์ได้ด้วยตัวเอง',
    'ใช้ Turso (LibSQL) เป็น Cloud Database สำหรับเก็บข้อมูลได้อย่างมั่นใจ',
    'ออกแบบ Database Schema และทำ Migration ด้วย Drizzle ORM',
    'สร้าง REST API ด้วย Next.js Route Handlers',
    'ทำระบบ CRUD (Create, Read, Update, Delete) ครบวงจร',
    'เข้าใจ Server Components vs Client Components',
    'ทำ Form Validation ทั้งฝั่ง Client และ Server',
    'Deploy เว็บแอปขึ้น Vercel + Turso ได้จริง',
    'มีโปรเจกต์จริงเอาไปใส่ Portfolio ได้เลย'
  ],
  requirements = ARRAY[
    'มีคอมพิวเตอร์ที่ลง Node.js ได้ (Windows, macOS หรือ Linux)',
    'รู้จักการใช้ Terminal / Command Line เบื้องต้น (สอนใน Section แรก)',
    'ไม่จำเป็นต้องมีพื้นฐาน React หรือ Next.js มาก่อน',
    'ไม่จำเป็นต้องมีพื้นฐาน Database มาก่อน'
  ],
  target_audience = ARRAY[
    'ผู้เริ่มต้นที่อยากเรียนรู้การสร้างเว็บแอปแบบ Full Stack',
    'นักศึกษาหรือคนเปลี่ยนสายงานที่ต้องการ Portfolio โปรเจกต์จริง',
    'Frontend Developer ที่อยากเริ่มเขียน Backend',
    'คนที่เคยลอง React มาบ้างแต่ยังไม่เคยทำ Full Stack',
    'ผู้ที่สนใจ Modern Tech Stack ที่ใช้กันจริงในปี 2026'
  ],
  syllabus = '[
    {
      "title": "บทที่ 1: เตรียมตัวก่อนเริ่ม — ติดตั้ง Tools & เข้าใจภาพรวม",
      "lessons": [
        "Full Stack คืออะไร? เข้าใจภาพรวมทั้งระบบใน 10 นาที",
        "ทำไมต้อง Next.js + Turso + Drizzle? เลือก Stack ให้ถูกตัว",
        "ติดตั้ง Node.js, VS Code และ Extension ที่จำเป็น",
        "รู้จัก Terminal / Command Line สำหรับมือใหม่"
      ]
    },
    {
      "title": "บทที่ 2: สร้างโปรเจกต์ Next.js แรกของคุณ",
      "lessons": [
        "สร้างโปรเจกต์ด้วย create-next-app และทำความเข้าใจโครงสร้างไฟล์",
        "App Router 101 — ระบบ Routing ใน Next.js",
        "สร้างหน้าเว็บแรก: หน้า Home และ About",
        "Layout & Nested Layouts — โครงสร้างหน้าเว็บที่ดี",
        "เข้าใจ Server Components vs Client Components"
      ]
    },
    {
      "title": "บทที่ 3: พื้นฐาน React ที่จำเป็น (สำหรับมือใหม่)",
      "lessons": [
        "JSX คืออะไร? เขียน HTML ใน JavaScript",
        "Component, Props และ State เบื้องต้น",
        "Event Handling — ทำให้หน้าเว็บ Interactive",
        "useEffect และ useState Hook ที่ใช้บ่อย",
        "แบบฝึกหัด: สร้าง Counter App และ Todo List"
      ]
    },
    {
      "title": "บทที่ 4: ตั้งค่า Turso — Database บน Cloud",
      "lessons": [
        "Turso คืออะไร? ทำไมถึงเหมาะกับ Next.js",
        "สมัครบัญชี Turso และสร้าง Database แรก",
        "ติดตั้ง Turso CLI และเชื่อมต่อ Database",
        "รู้จัก SQL เบื้องต้น: SELECT, INSERT, UPDATE, DELETE"
      ]
    },
    {
      "title": "บทที่ 5: Drizzle ORM — จัดการ Database แบบ Type-safe",
      "lessons": [
        "ORM คืออะไร? ทำไมต้อง Drizzle?",
        "ติดตั้งและตั้งค่า Drizzle กับ Turso",
        "ออกแบบ Schema ด้วย TypeScript — ลืม SQL ดิบไปได้เลย",
        "Drizzle Kit: Push, Generate และ Migrate",
        "Drizzle Studio — ดูข้อมูลใน Database ผ่าน GUI"
      ]
    },
    {
      "title": "บทที่ 6: สร้าง API ด้วย Next.js Route Handlers",
      "lessons": [
        "Route Handlers คืออะไร? สร้าง API ใน Next.js",
        "GET — ดึงข้อมูลจาก Database",
        "POST — เพิ่มข้อมูลใหม่",
        "PUT & DELETE — แก้ไขและลบข้อมูล",
        "Error Handling และ Response Format"
      ]
    },
    {
      "title": "บทที่ 7: สร้าง Mini Project — ระบบจัดการสินค้า (Product Manager)",
      "lessons": [
        "วางแผนโปรเจกต์: Wireframe & Database Schema",
        "สร้างหน้ารายการสินค้า (Product List) ด้วย Server Component",
        "ฟอร์มเพิ่มสินค้าใหม่ พร้อม Validation",
        "หน้าแก้ไขสินค้า พร้อม Dynamic Routes",
        "ปุ่มลบสินค้า พร้อม Confirmation Dialog"
      ]
    },
    {
      "title": "บทที่ 8: Styling — ทำให้เว็บสวยด้วย Tailwind CSS",
      "lessons": [
        "Tailwind CSS เบื้องต้นสำหรับ Next.js",
        "Responsive Design — รองรับทุกหน้าจอ",
        "Dark Mode ง่ายๆ ใน 5 นาที",
        "สร้าง Component Library ของตัวเอง (Button, Card, Input)"
      ]
    },
    {
      "title": "บทที่ 9: Authentication & Middleware",
      "lessons": [
        "รู้จัก Authentication: Session vs JWT",
        "ทำระบบ Login ง่ายๆ ด้วย NextAuth.js",
        "Middleware — ป้องกันหน้าที่ต้อง Login ก่อน",
        "แสดงข้อมูล User ใน Navbar"
      ]
    },
    {
      "title": "บทที่ 10: Deploy ขึ้น Production จริง!",
      "lessons": [
        "เตรียมโปรเจกต์สำหรับ Deploy",
        "Deploy Next.js ขึ้น Vercel แบบ Step-by-step",
        "ตั้งค่า Environment Variables บน Vercel",
        "เชื่อมต่อ Turso Database กับ Production",
        "ทดสอบและแก้ไขปัญหาบน Production"
      ]
    },
    {
      "title": "Workshop 1: 📝 Guestbook App — สมุดเยี่ยมออนไลน์",
      "lessons": [
        "วางแผนโปรเจกต์ Guestbook: ต้องมีอะไรบ้าง?",
        "สร้าง Schema ตาราง messages ด้วย Drizzle",
        "ทำฟอร์มเพิ่มข้อความ พร้อม Server Action",
        "แสดงรายการข้อความแบบ Real-time ด้วย Server Component",
        "เพิ่ม Emoji Reactions และ Timestamp"
      ]
    },
    {
      "title": "Workshop 2: 💰 Expense Tracker — แอปบันทึกรายรับ-รายจ่าย",
      "lessons": [
        "ออกแบบ Database Schema สำหรับ Income/Expense",
        "สร้างฟอร์มบันทึกรายการ พร้อม Category Dropdown",
        "หน้ารายการ Transaction พร้อม Filter ตามวันที่/ประเภท",
        "สรุปยอดรวม: รายรับ, รายจ่าย, คงเหลือ (Aggregate Query)",
        "ทำกราฟ Donut Chart แสดงสัดส่วนค่าใช้จ่ายแต่ละหมวด"
      ]
    },
    {
      "title": "Workshop 3: 🔗 URL Shortener — ย่อลิงก์แบบ bit.ly",
      "lessons": [
        "ออกแบบระบบ: Short Code Generation & Redirect",
        "สร้าง API สำหรับย่อลิงก์ พร้อม Validation",
        "ทำหน้า Redirect ด้วย Dynamic Routes",
        "นับจำนวนคลิก และแสดง Analytics เบื้องต้น",
        "เพิ่มปุ่ม Copy to Clipboard และ QR Code Generator"
      ]
    },
    {
      "title": "Workshop 4: ✅ Task Board — บอร์ดจัดการงานแบบ Trello",
      "lessons": [
        "ออกแบบ Schema: Board, Column, Task",
        "สร้าง Kanban Board UI (Todo / Doing / Done)",
        "ทำ Drag & Drop ย้าย Task ข้ามคอลัมน์",
        "Optimistic UI — อัปเดตหน้าจอก่อนรอ Server ตอบ",
        "เพิ่ม Due Date, Priority Label และ Search"
      ]
    },
    {
      "title": "Workshop 5: 📰 Mini Blog + Auth — บล็อกส่วนตัวพร้อมระบบ Login",
      "lessons": [
        "วางโครงสร้าง Blog: Posts, Authors, Tags",
        "ระบบ Login ด้วย NextAuth.js + GitHub Provider",
        "หน้าเขียนบทความ พร้อม Markdown Editor",
        "แสดงบทความ พร้อม Syntax Highlighting & Pagination",
        "Protected Routes: เฉพาะเจ้าของแก้ไข/ลบบทความได้"
      ]
    }
  ]'::jsonb,
  about_course = 'คอร์สนี้ออกแบบมาสำหรับคนที่ไม่มีพื้นฐานการเขียนโปรแกรมเว็บมาก่อน หรือเคยลองแต่ยังไม่เคยสร้าง Full Stack App ด้วยตัวเอง คุณจะได้เรียนรู้ตั้งแต่พื้นฐาน HTML/CSS/JavaScript ที่จำเป็น ไปจนถึงการสร้าง Web Application แบบครบวงจรด้วย Next.js (App Router), Turso (SQLite บน Cloud ที่เร็วมากและฟรี) และ Drizzle ORM (จัดการ Database แบบ Type-safe ด้วย TypeScript) พร้อม Deploy ขึ้น Vercel ให้คนอื่นเข้าใช้งานได้จริง ทุกบทเรียนเน้นลงมือทำ (Hands-on) พร้อมโปรเจกต์จริงที่สามารถนำไปใส่ Portfolio ได้ทันที — เหมาะมากสำหรับคนที่อยากเปลี่ยนสายหรือเริ่มต้นอาชีพ Developer',
  has_interactive_lab = FALSE,
  interactive_lab_slug = NULL
WHERE id = '40000000-0000-0000-0000-000000000140';
