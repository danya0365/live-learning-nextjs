import { AuthProfile } from '@/src/application/repositories/IAuthRepository';
import { Achievement, UserProfile } from '@/src/application/repositories/IProfileRepository';

export const DEMO_PROFILE: UserProfile = {
  id: 'student-001',
  name: 'น้องมิน',
  email: 'min@demo.com',
  avatar: '🧑‍💻',
  joinDate: '2025-09-15',
  level: 'Intermediate',
  role: 'student',
};

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  { icon: '🎯', label: 'เรียนครบ 10 ชม.', description: 'เรียนสะสมครบ 10 ชั่วโมง' },
  { icon: '🔥', label: 'เข้าเรียน 7 วันติด', description: 'เข้าเรียนต่อเนื่อง 7 วัน' },
  { icon: '⭐', label: 'จองคอร์สแรก', description: 'จองคอร์สเรียนครั้งแรก' },
  { icon: '🏆', label: 'Top Student', description: 'ได้คะแนนสูงสุดในคลาส' },
];

export const MOCK_AUTH_PROFILES: Record<string, AuthProfile> = {
  'student-001': {
    id: 'student-001',
    authId: 'auth-001',
    fullName: 'น้องมิน',
    email: 'min@demo.com',
    avatarUrl: '🧑‍💻',
    createdAt: '2025-09-15',
    updatedAt: '2025-09-15',
    role: 'student',
    verificationStatus: 'verified',
    isActive: true,
    preferences: { language: 'th', notifications: true, theme: 'auto' },
  } as AuthProfile,
  'instructor-001': {
    id: 'instructor-001',
    authId: 'auth-inst-001',
    fullName: 'อ.สมชาย',
    email: 'somchai@demo.com',
    avatarUrl: '👨‍🏫',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    role: 'instructor',
    verificationStatus: 'verified',
    isActive: true,
    preferences: { language: 'th', notifications: true, theme: 'auto' },
    level: 'Senior Instructor',
  } as AuthProfile,
  'admin-001': {
    id: 'admin-001',
    authId: 'auth-admin-001',
    fullName: 'แอดมิน',
    email: 'admin@demo.com',
    avatarUrl: '🛡️',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    role: 'admin',
    verificationStatus: 'verified',
    isActive: true,
    preferences: { language: 'th', notifications: true, theme: 'auto' },
  } as AuthProfile,
};

export const INSTRUCTOR_ACHIEVEMENTS: Achievement[] = [
  { icon: '👨‍🏫', label: 'สอนครบ 100 ชม.', description: 'สอนสะสมครบ 10 ชั่วโมง' },
  { icon: '⭐', label: 'Top Rated', description: 'คะแนนรีวิวเฉลี่ย 4.9' },
];

export const ADMIN_ACHIEVEMENTS: Achievement[] = [
  { icon: '🛡️', label: 'System Admin', description: 'ผู้ดูแลระบบสูงสุด' },
];
