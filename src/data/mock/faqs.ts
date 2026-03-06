import { FAQItem } from '@/src/application/repositories/IFAQRepository';

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'Live Learning คืออะไร?',
    answer: 'Live Learning คือแพลตฟอร์มการเรียนรู้ออนไลน์ที่เน้นการเรียนสดกับอาจารย์ผู้เชี่ยวชาญ เพื่อให้ผู้เรียนสามารถโต้ตอบและสอบถามได้ทันที',
    category: 'ทั่วไป',
    isActive: true,
    order: 1,
  },
  {
    id: 'faq-002',
    question: 'ฉันจะสมัครเรียนได้อย่างไร?',
    answer: 'คุณสามารถเลือกคอร์สที่สนใจ และกดปุ่ม "สมัครเรียน" หรือ "จองเวลาเรียน" จากหน้ารายละเอียดคอร์สได้เลย',
    category: 'การสมัครเรียน',
    isActive: true,
    order: 2,
  },
  {
    id: 'faq-003',
    question: 'มีค่าใช้จ่ายในการสมัครสมาชิกหรือไม่?',
    answer: 'การสมัครสมาชิก Live Learning ไม่มีค่าใช้จ่าย คุณจะเสียค่าใช้จ่ายเฉพาะเมื่อลงทะเบียนเรียนในคอร์สเท่านั้น',
    category: 'การสมัครเรียน',
    isActive: true,
    order: 3,
  },
  {
    id: 'faq-004',
    question: 'ฉันสามารถขอคืนเงินได้หรือไม่?',
    answer: 'เรามีนโยบายคืนเงินภายใน 7 วัน หากคุณไม่พอใจในการเรียนการสอน หรือมีเหตุผลอันสมควร',
    category: 'การชำระเงิน',
    isActive: true,
    order: 4,
  },
  {
    id: 'faq-005',
    question: 'เรียนผ่านอุปกรณ์ใดได้บ้าง?',
    answer: 'รองรับการใช้งานผ่านคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน ทั้งระบบ iOS และ Android ผ่านเว็บเบราว์เซอร์',
    category: 'เทคนิค',
    isActive: true,
    order: 5,
  },
];
