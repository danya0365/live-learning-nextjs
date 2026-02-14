import { Achievement, IProfileRepository, StudentProfile } from '@/src/application/repositories/IProfileRepository';

const DEMO_PROFILE: StudentProfile = {
  id: 'student-001',
  name: 'น้องมิน',
  email: 'min@demo.com',
  avatar: '🧑‍💻',
  joinDate: '2025-09-15',
  level: 'Intermediate',
};

const DEMO_ACHIEVEMENTS: Achievement[] = [
  { icon: '🎯', label: 'เรียนครบ 10 ชม.', description: 'เรียนสะสมครบ 10 ชั่วโมง' },
  { icon: '🔥', label: 'เข้าเรียน 7 วันติด', description: 'เข้าเรียนต่อเนื่อง 7 วัน' },
  { icon: '⭐', label: 'จองคอร์สแรก', description: 'จองคอร์สเรียนครั้งแรก' },
  { icon: '🏆', label: 'Top Student', description: 'ได้คะแนนสูงสุดในคลาส' },
];

export class MockProfileRepository implements IProfileRepository {
  async getProfile(userId: string): Promise<StudentProfile | null> {
    // Return specific profile for demo instructor
    if (userId === 'instructor-001') {
      return {
        id: userId,
        name: 'อ.สมชาย',
        email: 'somchai@demo.com',
        avatar: '👨‍🏫',
        joinDate: '2024-03-01',
        level: 'Expert',
      };
    }
    
    // Return specific profile for demo admin
    if (userId === 'admin-001') {
      return {
        id: userId,
        name: 'แอดมิน',
        email: 'admin@demo.com',
        avatar: '🛡️',
        joinDate: '2024-01-01',
        level: 'Master',
      };
    }

    // Default to student profile
    return { ...DEMO_PROFILE, id: userId };
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    if (userId === 'instructor-001') {
      return [
        { icon: '👨‍🏫', label: 'สอนครบ 100 ชม.', description: 'สอนสะสมครบ 100 ชั่วโมง' },
        { icon: '⭐', label: 'Top Rated', description: 'คะแนนรีวิวเฉลี่ย 4.9' },
      ];
    }
    if (userId === 'admin-001') {
      return [
        { icon: '🛡️', label: 'System Admin', description: 'ผู้ดูแลระบบสูงสุด' },
      ];
    }
    return [...DEMO_ACHIEVEMENTS];
  }
}
