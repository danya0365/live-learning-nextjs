import { AuthProfile } from '@/src/application/repositories/IAuthRepository';
import { Achievement, IProfileRepository, UserProfile } from '@/src/application/repositories/IProfileRepository';

const DEMO_PROFILE: UserProfile = {
  id: 'student-001',
  name: 'น้องมิน',
  email: 'min@demo.com',
  avatar: '🧑‍💻',
  joinDate: '2025-09-15',
  level: 'Intermediate',
  role: 'student',
};

const DEMO_ACHIEVEMENTS: Achievement[] = [
  { icon: '🎯', label: 'เรียนครบ 10 ชม.', description: 'เรียนสะสมครบ 10 ชั่วโมง' },
  { icon: '🔥', label: 'เข้าเรียน 7 วันติด', description: 'เข้าเรียนต่อเนื่อง 7 วัน' },
  { icon: '⭐', label: 'จองคอร์สแรก', description: 'จองคอร์สเรียนครั้งแรก' },
  { icon: '🏆', label: 'Top Student', description: 'ได้คะแนนสูงสุดในคลาส' },
];

export class MockProfileRepository implements IProfileRepository {
  async getProfile(): Promise<AuthProfile | null> {
    return {
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
    } as AuthProfile;
  }

  async getById(id: string): Promise<AuthProfile | null> {
    // Return specific profile for demo instructor
    if (id === 'instructor-001') {
      return {
        id,
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
      } as AuthProfile;
    }
    
    // Return specific profile for demo admin
    if (id === 'admin-001') {
      return {
        id,
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
      } as AuthProfile;
    }

    // Default to student profile
    return {
      id,
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
    } as AuthProfile;
  }

  async getProfiles(): Promise<AuthProfile[]> {
      return [
          {
              id: 'student-001',
              authId: 'auth-001', 
              fullName: 'น้องมิน',
              email: 'min@demo.com',
              avatarUrl: '🧑‍💻',
              role: 'student',
              verificationStatus: 'verified',
              isActive: true,
              preferences: { language: 'th', notifications: true, theme: 'auto' },
              createdAt: '2025-09-15',
              updatedAt: '2025-09-15'
          } as AuthProfile
      ];
  }

  async switchProfile(profileId: string): Promise<boolean> {
      return true;
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
