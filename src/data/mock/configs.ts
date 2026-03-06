import { Category, Level } from '@/src/application/repositories/IConfigRepository';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-001', label: 'Web Development', icon: '🌐' },
  { id: 'cat-002', label: 'Data Science & AI', icon: '🤖' },
  { id: 'cat-003', label: 'Design', icon: '🎨' },
  { id: 'cat-004', label: 'Mobile Development', icon: '📱' },
  { id: 'cat-005', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'cat-006', label: 'DevOps & Cloud', icon: '☁️' },
];

export const MOCK_LEVELS: Level[] = [
  { value: 'beginner', label: 'เริ่มต้น', icon: '🌱', desc: 'ยังไม่มีพื้นฐาน อยากเรียนจาก 0', color: 'text-success' },
  { value: 'intermediate', label: 'ปานกลาง', icon: '📈', desc: 'มีพื้นฐานแล้ว อยากเรียนเชิงลึก', color: 'text-warning' },
  { value: 'advanced', label: 'ขั้นสูง', icon: '🚀', desc: 'มีประสบการณ์ ต้องการระดับ Expert', color: 'text-error' },
];
