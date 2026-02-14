import { Achievement, IProfileRepository, StudentProfile } from '@/src/application/repositories/IProfileRepository';

const DEMO_PROFILE: StudentProfile = {
  id: 'student-001',
  name: 'น้องมิน',
  email: 'min@example.com',
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
  async getProfile(studentId: string): Promise<StudentProfile | null> {
    // For demo purposes, return the same profile regardless of ID
    return { ...DEMO_PROFILE, id: studentId };
  }

  async getAchievements(studentId: string): Promise<Achievement[]> {
    return [...DEMO_ACHIEVEMENTS];
  }
}
