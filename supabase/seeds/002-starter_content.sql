-- Live Learning Seed Data — Starter Content (Real Courses)
-- Created: 2026-02-14
-- Description: Comprehensive course catalog organized by domain.
--              Includes 36 high-value courses across AI, Web, Mobile, Game, and Business.
--              Language: Thai (Technical terms in English)

-- ============================================================================
-- 1. INSTRUCTOR PROFILE (Super Admin)
-- ============================================================================
INSERT INTO public.instructor_profiles (id, profile_id, title, specializations, bio, rating, total_students, total_courses, hourly_rate, languages, is_online, is_active)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',           -- Instructor Profile ID
    '10000000-0000-0000-0000-000000000001',           -- Profile ID (Super Admin)
    'Lead Instructor',                                -- Title
    '{"AI Specialist", "Full-stack", "System Design"}', -- Specializations
    'วิศวกรและสถาปนิกซอฟต์แวร์อาวุโส ผู้เชี่ยวชาญด้าน AI และการพัฒนาแอประดับ Enterprise พร้อมถ่ายทอดประสบการณ์จริง', -- Bio
    5.00,                                             -- Rating
    0,                                                -- Total Students
    0,                                                -- Total Courses
    3000,                                             -- Hourly Rate
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

  -- ==========================================================================
  -- SECTION 1: AI & DATA SCIENCE (The Trending Stack)
  -- ==========================================================================
  -- 21. LangChain RAG
  (
    '40000000-0000-0000-0000-000000000121', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'สร้างแอป AI สุดล้ำด้วย LangChain & Pinecone', 'langchain-rag-apps', 'เรียนรู้วิธีสร้างแอป "คุยกับไฟล์ PDF" หรือ Chatbot องค์กร โดยใช้เทคนิค RAG (Retrieval-Augmented Generation) และ Vector Databases', 3500, 5000, 5.00, 0, 0, 15, 25, 'advanced', '{"LangChain", "AI", "Vector DB", "RAG"}', TRUE, TRUE, TRUE
  ),
  -- 22. Fine-Tuning LLMs
  (
    '40000000-0000-0000-0000-000000000122', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'เจาะลึก Fine-Tuning LLaMA 3 & Mistral', 'fine-tuning-llms', 'สร้างโมเดล LLM ส่วนตัวของคุณเอง! สอนเทรน AI ด้วยข้อมูลเฉพาะทางโดยใช้เทคนิค LoRA และ QLoRA เพื่อประสิทธิภาพสูงสุด', 4500, 6000, 5.00, 0, 0, 20, 30, 'advanced', '{"LLM", "Fine-Tuning", "Python", "AI"}', FALSE, TRUE, TRUE
  ),
  -- 23. AI Agents
  (
    '40000000-0000-0000-0000-000000000123', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'สร้างผู้ช่วยอัจฉริยะ Autonomous AI Agents ด้วย AutoGPT', 'autonomous-ai-agents', 'สร้าง AI Agents ที่คิดเองและทำงานเองได้จริง สามารถท่องเว็บ เขียนโค้ด และทำงานซับซ้อนแทนคุณได้อัตโนมัติ', 2800, 3800, 5.00, 0, 0, 12, 18, 'intermediate', '{"Agents", "AutoGPT", "AI"}', TRUE, FALSE, TRUE
  ),
  -- 24. Stable Diffusion
  (
    '40000000-0000-0000-0000-000000000124', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'Mastering Generative Art: Stable Diffusion & Midjourney', 'stable-diffusion-art', 'ก้าวสู่การเป็น AI Artist มืออาชีพ สอน Prompt แบบเจาะลึก และเทคนิค ControlNet / Inpainting เพื่อควบคุมภาพให้ออกมาดั่งใจ', 1500, 2500, 5.00, 0, 0, 8, 15, 'beginner', '{"Generative Art", "Midjourney", "Stable Diffusion"}', FALSE, FALSE, TRUE
  ),
  -- 25. Computer Vision
  (
    '40000000-0000-0000-0000-000000000125', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'สร้างระบบตรวจจับวัตถุด้วย YOLOv8 & OpenCV', 'yolo-computer-vision', 'เขียนโปรแกรมจับภาพวัตถุแบบ Real-time (Computer Vision) สำหรับงาน Security, จราจร หรือวิเคราะห์สินค้าหน้าร้าน', 2200, 3200, 5.00, 0, 0, 15, 25, 'intermediate', '{"Computer Vision", "YOLO", "Python"}', FALSE, FALSE, TRUE
  ),
  -- 26. AI Voice
  (
    '40000000-0000-0000-0000-000000000126', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'สร้างแอปโคลนเสียงด้วย AI (Voice Cloning & TTS)', 'ai-voice-cloning', 'สร้างแอปที่พูดได้เหมือนคนจริง! สอนใช้ ElevenLabs และ OpenAI Whisper API เพื่อทำระบบ Text-to-Speech สุดล้ำ', 1200, 2000, 5.00, 0, 0, 4, 10, 'intermediate', '{"Voice AI", "ElevenLabs", "Whisper"}', FALSE, FALSE, TRUE
  ),
  -- 27. TensorFlow.js
  (
    '40000000-0000-0000-0000-000000000127', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'Machine Learning บนหน้าเว็บด้วย TensorFlow.js', 'tensorflow-js', 'รัน AI บน Browser ได้โดยไม่ต้องง้อ Server! สอนทำ Face Filters และ Gesture Controls ด้วย JavaScript ล้วนๆ', 2500, 3500, 5.00, 0, 0, 18, 28, 'advanced', '{"JavaScript", "TensorFlow.js", "Web AI"}', TRUE, TRUE, TRUE
  ),
   -- 28. Advanced Prompt Engineering
  (
    '40000000-0000-0000-0000-000000000128', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'Advanced Prompt Engineering สำหรับนักพัฒนา', 'advanced-prompt-engineering', 'รู้ลึกเทคนิคสั่งงาน AI ขั้นเทพ ทั้ง Chain-of-thought, ReAct และการควบคุม LLM ให้ได้ผลลัพธ์ที่แม่นยำที่สุด', 1800, 3000, 5.00, 0, 0, 6, 15, 'advanced', '{"AI", "Prompting"}', TRUE, TRUE, TRUE
  ),
  -- 29. Hugging Face
  (
    '40000000-0000-0000-0000-000000000129', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'เจาะลึก NLP ด้วย Hugging Face Transformers', 'hugging-face-transformers', 'ใช้งานโมเดล NLP ระดับโลกสำหรับการจำแนกข้อความ แปลภาษา และวิเคราะห์อารมณ์ ในโปรเจกต์จริง', 2500, 3500, 5.00, 0, 0, 10, 20, 'intermediate', '{"NLP", "Hugging Face"}', FALSE, FALSE, TRUE
  ),
  -- 33. Local AI Privacy
  (
    '40000000-0000-0000-0000-000000000133', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
    'รัน Private GPT บนคอมตัวเองด้วย Ollama', 'local-private-ai', 'ไม่ง้อเน็ต ไม่กลัวข้อมูลรั่ว! สอนรัน LLaMA 3 และ Mistral บน Laptop ของคุณเองแบบ 100% Private', 900, 1500, 5.00, 0, 0, 2, 6, 'intermediate', '{"Ollama", "Local AI", "Privacy"}', FALSE, FALSE, TRUE
  ),

  -- ==========================================================================
  -- SECTION 2: WEB DEVELOPMENT (Frontend & Backend)
  -- ==========================================================================
  -- 1. Laravel
  (
    '40000000-0000-0000-0000-000000000101', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    'Modern Web Development ด้วย Laravel 11', 'laravel-modern-web', 'สร้างเว็บแอปพลิเคชันที่แข็งแกร่งด้วย Laravel 11 ครอบคลุม MVC, Eloquent ORM และการใช้ Inertia.js', 2900, 3900, 5.00, 0, 0, 30, 45, 'intermediate', '{"Laravel", "PHP", "Backend"}', TRUE, TRUE, TRUE
  ),
  -- 2. Next.js
  (
    '40000000-0000-0000-0000-000000000102', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    'Next.js 14 Fullstack Masterclass', 'nextjs-fullstack', 'เจาะลึก Server Components, App Router และ Server Actions เพื่อสร้าง React Web Apps ประสิทธิภาพสูง', 3500, 4500, 5.00, 0, 0, 35, 50, 'advanced', '{"Next.js", "React", "Fullstack"}', TRUE, TRUE, TRUE
  ),
  -- 3. NestJS
  (
    '40000000-0000-0000-0000-000000000103', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    'Scalable Backend ด้วย NestJS', 'nestjs-backend', 'พัฒนา Backend ระดับ Enterprise ด้วย NestJS, TypeScript และสถาปัตยกรรม Microservices', 2800, 3800, 5.00, 0, 0, 28, 40, 'advanced', '{"NestJS", "Node.js", "TypeScript"}', FALSE, FALSE, TRUE
  ),
  -- 13. Golang
  (
    '40000000-0000-0000-0000-000000000113', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    'Go: สร้าง Microservices ด้วย gRPC', 'golang-microservices', 'เข้าใจการทำงานแบบ Concurrency ของ Go, การใช้ gRPC, Protobuf และการสร้างระบบที่รองรับโหลดมหาศาล', 2500, 3200, 5.00, 0, 0, 15, 25, 'intermediate', '{"Go", "Golang", "Microservices", "gRPC"}', FALSE, FALSE, TRUE
  ),
  -- 14. System Design
  (
    '40000000-0000-0000-0000-000000000114', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
    'System Design สำหรับเตรียมสัมภาษณ์งาน Tech', 'system-design-interview', 'เตรียมพร้อมสัมภาษณ์บริษัทระดับ FAANG เรียนรู้ Scalability, Distributed Systems และ Pattern การออกแบบระบบขนาดใหญ่', 3900, 5000, 5.00, 0, 0, 20, 30, 'advanced', '{"System Design", "Architecture", "FAANG"}', FALSE, TRUE, TRUE
  ),

  -- ==========================================================================
  -- SECTION 3: MOBILE & GAME DEVELOPMENT
  -- ==========================================================================
  -- 4. React Native
  (
    '40000000-0000-0000-0000-000000000104', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004',
    'พัฒนาแอปมือถือด้วย React Native (iOS & Android)', 'react-native-mobile', 'สร้าง Mobile Apps ระดับ Production ทั้ง iOS และ Android ด้วย React Native และ Expo', 2200, 3000, 5.00, 0, 0, 25, 35, 'intermediate', '{"React Native", "Mobile", "iOS", "Android"}', TRUE, FALSE, TRUE
  ),
  -- 15. Flutter
  (
    '40000000-0000-0000-0000-000000000115', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004',
    'Flutter Advanced: สร้าง UI และ Animation สุดล้ำ', 'flutter-animations', 'ยกระดับการเขียน Flutter ด้วยการทำ Animation ที่ลื่นไหลและ UI Design ที่สวยงามดึงดูดผู้ใช้งาน', 1200, 1800, 5.00, 0, 0, 6, 12, 'advanced', '{"Flutter", "Animation", "UI/UX"}', FALSE, FALSE, TRUE
  ),
  -- 8. Phaser
  (
    '40000000-0000-0000-0000-000000000105', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007',
    'สร้างเกม 2D บนเว็บด้วย Phaser.js', 'phaser-game-dev', 'สนุกกับการเขียนเกม 2D ที่เล่นบน Browser ได้ทันที ด้วย JavaScript และ Phaser Framework', 1800, 2500, 5.00, 0, 0, 15, 20, 'beginner', '{"Phaser", "Game Dev", "JavaScript"}', FALSE, TRUE, TRUE
  ),
  -- 9. React Three Fiber
  (
    '40000000-0000-0000-0000-000000000106', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007',
    'สร้างเว็บ 3D สุดอลังการด้วย React Three Fiber', 'react-three-fiber', 'นำกราฟิก 3D มาสู่หน้าเว็บของคุณ! สอนใช้ React Three Fiber, Shaders และ WebGL แบบเข้าใจง่าย', 2600, 3600, 5.00, 0, 0, 18, 25, 'advanced', '{"Three.js", "React", "3D", "WebGL"}', TRUE, TRUE, TRUE
  ),
  -- 10. Godot
  (
    '40000000-0000-0000-0000-000000000107', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007',
    'พัฒนาเกม Indies ด้วย Godot 4', 'godot-game-dev', 'เรียนรู้ GDScript และสร้างเกม 2D/3D เกมแรกของคุณด้วย Game Engine ระดับโลก Godot Engine', 1500, 2200, 5.00, 0, 0, 24, 36, 'beginner', '{"Godot", "Game Dev", "GDScript"}', FALSE, TRUE, TRUE
  ),

  -- ==========================================================================
  -- SECTION 4: PRODUCTIVITY, BUSINESS & SHORT TRICKS
  -- ==========================================================================
  -- 30. AI for Excel
  (
    '40000000-0000-0000-0000-000000000130', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008',
    'Excel & Sheets AI Mastery: งานเสร็จในพริบตา', 'excel-ai-automation', 'เลิกปวดหัวกับสูตรยากๆ ใช้ ChatGPT ใน Excel/Sheets ช่วยคลีนข้อมูลและสรุปรายงานให้คุณในไม่กี่วินาที', 1500, 2500, 5.00, 0, 0, 3, 10, 'beginner', '{"Excel", "AI", "Productivity", "Sheets"}', FALSE, TRUE, TRUE
  ),
  -- 31. Viral Video AI
  (
    '40000000-0000-0000-0000-000000000131', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
    'สร้าง Viral Video ด้วย AI Tools (ไม่ต้องถ่ายเอง)', 'viral-ai-video', 'ใช้เครื่องมืออย่าง Runway, Pika และ HeyGen สร้างวิดีโอ Shorts/TikTok คุณภาพสูงโดยไม่ต้องใช้กล้องสักตัว', 2000, 3000, 5.00, 0, 0, 5, 12, 'beginner', '{"Video AI", "Marketing", "Content Creator"}', FALSE, FALSE, TRUE
  ),
  -- 32. SEO Content AI
  (
    '40000000-0000-0000-0000-000000000132', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
    'เขียนบทความ SEO ให้ติดหน้าแรกด้วย Claude 3', 'seo-content-ai', 'สร้าง Blog และ Landing Page ที่ Google รัก และผ่านการตรวจสอบ AI Detection ด้วยเทคนิคการเขียนร่วมกับ AI', 1200, 2000, 5.00, 0, 0, 4, 8, 'intermediate', '{"SEO", "Writing", "Marketing", "AI"}', FALSE, TRUE, TRUE
  ),
  -- 34. AI Coding Interview
  (
    '40000000-0000-0000-0000-000000000134', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
    'ผ่านสัมภาษณ์งาน Dev สบายๆ ด้วย AI Assistance', 'ai-coding-interview', 'เรียนรู้วิธีใช้ AI ติวโจทย์อัลกอริทึมยากๆ (LeetCode Hard) ให้เข้าใจง่าย เตรียมพร้อมสำหรับงานในฝัน', 1500, 2200, 5.00, 0, 0, 4, 10, 'advanced', '{"LeetCode", "Interview", "AI"}', FALSE, FALSE, TRUE
  ),
  -- 35. AI Avatars
  (
    '40000000-0000-0000-0000-000000000135', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003',
    'สร้าง Virtual Influencers และ AI Avatars', 'ai-avatars-influencer', 'ออกแบบคาแรคเตอร์ AI ให้สม่ำเสมอ (Consistent) สำหรับงานแบรนด์ดิ้งและโซเชียลมีเดียด้วย Midjourney', 1800, 2800, 5.00, 0, 0, 6, 15, 'intermediate', '{"Character Design", "Midjourney", "Brand"}', FALSE, TRUE, TRUE
  ),
  -- 36. AI Research Assistant
  (
    '40000000-0000-0000-0000-000000000136', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008',
    'ตัวช่วยวิจัยขั้นเทพ! สรุปเปเปอร์เป็นร้อยใน 1 นาที', 'ai-research-assistant', 'ใช้ Elicit และ SciSpace สรุปงานวิจัย ดึงข้อมูลสำคัญ และเขียน Literature Review ได้รวดเร็วอย่างไม่น่าเชื่อ', 800, 1500, 5.00, 0, 0, 2, 5, 'beginner', '{"Research", "Academic", "Productivity"}', FALSE, FALSE, TRUE
  ),
  -- 20. Freelancing
  (
    '40000000-0000-0000-0000-000000000110', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
    'คู่มือ Freelance Developer: จากศูนย์สู่ลูกค้าคนแรก', 'freelancing-developers', 'สอนวิธีหาลูกค้ากระเป๋าหนักบน Upwork, การตั้งราคา และการเจรจาต่อรองให้ได้งานแบบมืออาชีพ', 1200, 2000, 5.00, 0, 0, 5, 12, 'beginner', '{"Freelancing", "Business", "Career"}', FALSE, TRUE, TRUE
  ),
  -- 11. Indie Hacker
  (
    '40000000-0000-0000-0000-000000000118', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009',
    'คู่มือ Indie Hacker: เปิดตัว SaaS บน Product Hunt', 'indie-hacker-launch', 'เจาะลึกทุกขั้นตอนการปั้นโปรเจกต์ SaaS ให้ประสบความสำเร็จ ตั้งแต่ไอเดียจนถึงการเปิดตัว', 1500, 2500, 5.00, 0, 0, 4, 10, 'intermediate', '{"SaaS", "Indie Hacker", "Marketing"}', FALSE, TRUE, TRUE
  ),
  -- 16. Docker
  (
    '40000000-0000-0000-0000-000000000112', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006',
    'Docker for Beginners: พื้นฐาน Containerization', 'docker-beginners', 'เข้าใจการทำงานของ Container, Images และ Docker Compose เพื่อจัดการ Environment ให้เป็นเรื่องง่าย', 900, 1500, 5.00, 0, 0, 4, 10, 'beginner', '{"Docker", "DevOps", "Containers"}', FALSE, FALSE, TRUE
  ),
  -- 17. SaaS Deployment
  (
    '40000000-0000-0000-0000-000000000109', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006',
    'Deploy SaaS ใน 1 ชั่วโมง: Vercel & Supabase', 'deploy-saas-1-hour', 'ทางลัดสำหรับ Dev! สอน Deploy แอป Next.js พร้อม Database จริงขึ้นบน Cloud อย่างรวดเร็ว', 900, 1500, 5.00, 0, 0, 1, 8, 'intermediate', '{"Deployment", "Vercel", "Supabase", "SaaS"}', TRUE, TRUE, TRUE
  ),
  -- 18. VS Code
  (
    '40000000-0000-0000-0000-000000000108', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008',
    'VS Code Power User: รวมคีย์ลัดและส่วนเสริมเทพๆ', 'vscode-power-user', 'เขียนโค้ดไวขึ้น 2 เท่า! ด้วยคีย์ลัด Extensions ที่จำเป็น และการตั้งค่าลับๆ ของ VS Code', 500, 900, 5.00, 0, 0, 2, 12, 'beginner', '{"VS Code", "Productivity", "Tools"}', FALSE, FALSE, TRUE
  ),
  -- 19. Git
  (
    '40000000-0000-0000-0000-000000000117', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008',
    'Git Mastery: เลิกกลัว Merge Conflict', 'git-mastery', 'เจาะลึกคำสั่ง Git ขั้นสูงอย่าง Rebase, Cherry-pick และ Bisect เพื่อจัดการ Version Control แบบโปร', 900, 1500, 5.00, 0, 0, 3, 15, 'intermediate', '{"Git", "Version Control", "Productivity"}', FALSE, FALSE, TRUE
  ),
  -- 12. Bubble.io
  (
    '40000000-0000-0000-0000-000000000119', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010',
    'สร้างแอปไม่ต้องเขียนโค้ดด้วย Bubble.io', 'bubble-io-masterclass', 'สร้าง Web Application ที่ใช้งานได้จริง มี database ในตัว โดยไม่ต้องเขียนโค้ดแม้แต่บรรทัดเดียว', 2000, 3000, 5.00, 0, 0, 12, 25, 'beginner', '{"No-Code", "Bubble", "MVP"}', FALSE, TRUE, TRUE
  ),
  -- 12B. Zapier
  (
    '40000000-0000-0000-0000-000000000120', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010',
    'Automate ธุรกิจด้วย Zapier (ลดงานซ้ำซาก)', 'zapier-automation', 'เชื่อมต่อ Gmail, Slack, Notion และแอปต่างๆ ให้ทำงานร่วมกันอัตโนมัติ ประหยัดเวลาทำงานไปมหาศาล', 1200, 1800, 5.00, 0, 0, 3, 10, 'beginner', '{"Automation", "Zapier", "Productivity"}', FALSE, FALSE, TRUE
  )

ON CONFLICT (id) DO NOTHING;
