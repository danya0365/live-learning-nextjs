-- ============================================================================
-- Live Learning: Consultation Requests & Offers Seed Data
-- Created: 2026-02-13
-- Author: Marosdee Uma
-- Description: Mock data for student consultation requests and instructor offers
-- ============================================================================

-- Consultation Requests (from students)
INSERT INTO public.consultation_requests (id, student_profile_id, category_id, title, description, level, budget_min, budget_max, preferred_dates, preferred_times, status, offers_count, accepted_offer_id, is_active, created_at, updated_at)
VALUES
  -- req-001: น้องมิน — Next.js (open, 2 offers)
  (
    'a0000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000020', -- min (student)
    '20000000-0000-0000-0000-000000000001', -- Web Dev
    'ช่วยสอน Next.js App Router + Server Components',
    'ผมกำลังทำโปรเจกต์ส่งมหาลัย ต้องใช้ Next.js 14 แต่ยังไม่เข้าใจ App Router กับ Server Components ดีพอ อยากได้คนสอนแบบ 1-on-1 ประมาณ 2-3 ชม.',
    'intermediate', 500, 1500,
    '["2026-03-20","2026-03-21","2026-03-22"]'::jsonb,
    '[{"start":"13:00","end":"16:00"},{"start":"18:00","end":"21:00"}]'::jsonb,
    'open', 2, NULL, TRUE,
    '2026-02-10 08:00:00+07', '2026-02-10 08:00:00+07'
  ),
  -- req-002: น้องเบล — LLM Fine-tuning (open, 1 offer)
  (
    'a0000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000021', -- bel (student)
    '20000000-0000-0000-0000-000000000002', -- Data Science & AI
    'ต้องการปรึกษาเรื่อง Fine-tuning LLM',
    'กำลังทำ thesis เกี่ยวกับ Fine-tuning LLM สำหรับภาษาไทย ต้องการคนเชี่ยวชาญ NLP มาช่วยให้คำปรึกษา',
    'advanced', 1500, 3000,
    '["2026-03-18","2026-03-19"]'::jsonb,
    '[{"start":"09:00","end":"12:00"}]'::jsonb,
    'open', 1, NULL, TRUE,
    '2026-02-11 10:30:00+07', '2026-02-11 10:30:00+07'
  ),
  -- req-003: น้องบอส — Figma Design System (in_progress, accepted offer-005)
  (
    'a0000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000022', -- boss (student)
    '20000000-0000-0000-0000-000000000003', -- Design
    'อยากเรียน Figma สร้าง Design System ตั้งแต่ 0',
    'ผมเป็น developer แต่ต้องทำ design เองด้วย อยากเรียนวิธีสร้าง Design System ใน Figma ที่ใช้งานได้จริง',
    'beginner', 400, 800,
    '["2026-03-22","2026-03-23"]'::jsonb,
    '[{"start":"10:00","end":"12:00"},{"start":"14:00","end":"17:00"}]'::jsonb,
    'in_progress', 3, NULL, TRUE,
    '2026-02-08 06:00:00+07', '2026-02-12 09:00:00+07'
  ),
  -- req-004: น้องฟ้า — Flutter + Firebase (open, 0 offers)
  (
    'a0000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000023', -- fa (student)
    '20000000-0000-0000-0000-000000000004', -- Mobile Dev
    'สอนทำ Flutter App เชื่อมต่อ Firebase',
    'อยากทำแอปมือถือส่งงาน ใช้ Flutter + Firebase Authentication + Cloud Firestore ต้องการคนสอนทำ step by step',
    'beginner', 600, 1200,
    '["2026-03-25","2026-03-26","2026-03-27"]'::jsonb,
    '[{"start":"16:00","end":"19:00"}]'::jsonb,
    'open', 0, NULL, TRUE,
    '2026-02-13 07:00:00+07', '2026-02-13 07:00:00+07'
  ),
  -- req-005: น้องมิน — Pen Testing (closed, accepted offer-006)
  (
    'a0000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000020', -- min (student)
    '20000000-0000-0000-0000-000000000005', -- Cybersecurity
    'สอน Penetration Testing เบื้องต้น',
    'สนใจเรื่อง Ethical Hacking อยากเรียนพื้นฐาน Pen Testing ใช้ Kali Linux + Burp Suite',
    'beginner', 800, 2000,
    '["2026-03-28"]'::jsonb,
    '[{"start":"09:00","end":"12:00"},{"start":"13:00","end":"16:00"}]'::jsonb,
    'closed', 1, NULL, TRUE,
    '2026-01-25 09:00:00+07', '2026-02-05 14:00:00+07'
  )
ON CONFLICT (id) DO NOTHING;

-- Consultation Offers (from instructors)
INSERT INTO public.consultation_offers (id, request_id, instructor_profile_id, message, offered_price, offered_date, offered_start_time, offered_end_time, status, is_active, created_at, updated_at)
VALUES
  -- offer-001: อ.สมชาย → req-001 (pending)
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000010', -- somchai
    'ผมเชี่ยวชาญ Next.js App Router โดยตรงครับ สอนทั้ง Server Components, Streaming, Parallel Routes ได้หมด',
    1200, '2026-03-20', '13:00', '15:00',
    'pending', TRUE,
    '2026-02-10 14:00:00+07', '2026-02-10 14:00:00+07'
  ),
  -- offer-002: อ.ธนกร → req-001 (pending)
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000013', -- thanakorn
    'ถึงผมเชี่ยวชาญ Mobile เป็นหลัก แต่ผมก็ใช้ Next.js ในโปรเจกต์ Web ด้วยครับ ช่วยสอนพื้นฐาน App Router ได้',
    800, '2026-03-21', '18:00', '20:00',
    'pending', TRUE,
    '2026-02-11 09:00:00+07', '2026-02-11 09:00:00+07'
  ),
  -- offer-003: ดร.นภา → req-002 (pending)
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000011', -- napa
    'ผมทำวิจัย NLP ภาษาไทยมาหลายปีครับ เคย fine-tune ทั้ง WangchanBERTa และ typhoon LLM',
    2500, '2026-03-18', '09:00', '12:00',
    'pending', TRUE,
    '2026-02-12 08:00:00+07', '2026-02-12 08:00:00+07'
  ),
  -- offer-004: อ.สมชาย → req-003 (rejected)
  (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000010', -- somchai
    'ผมเคยสร้าง Design System ให้หลายโปรเจกต์ ช่วยสอนมุมมอง developer ที่ใช้ design system ได้ครับ',
    700, '2026-03-22', '10:00', '12:00',
    'rejected', TRUE,
    '2026-02-09 11:00:00+07', '2026-02-12 09:00:00+07'
  ),
  -- offer-005: อ.พิมพ์ลดา → req-003 (accepted)
  (
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000012', -- pimlada
    'ผมเชี่ยวชาญ Figma โดยตรงค่ะ เคยเป็น Lead Designer ที่ LINE สร้าง Design System มาหลายระบบ',
    650, '2026-03-22', '14:00', '17:00',
    'accepted', TRUE,
    '2026-02-09 15:00:00+07', '2026-02-12 09:00:00+07'
  ),
  -- offer-006: อ.วีรภัทร → req-005 (accepted)
  (
    'b0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000014', -- weerapat
    'Pen Testing เป็นความถนัดผมเลยครับ สอนใช้ Kali Linux, Burp Suite, Nmap ได้หมด',
    1500, '2026-03-28', '09:00', '12:00',
    'accepted', TRUE,
    '2026-01-28 10:00:00+07', '2026-02-05 14:00:00+07'
  )
ON CONFLICT (id) DO NOTHING;

-- Update accepted_offer_id after offers are inserted
UPDATE public.consultation_requests SET accepted_offer_id = 'b0000000-0000-0000-0000-000000000005' WHERE id = 'a0000000-0000-0000-0000-000000000003';
UPDATE public.consultation_requests SET accepted_offer_id = 'b0000000-0000-0000-0000-000000000006' WHERE id = 'a0000000-0000-0000-0000-000000000005';
