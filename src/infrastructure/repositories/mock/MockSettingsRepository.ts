import {
    ISettingsRepository,
    UpdatePasswordData,
    UpdateProfileData,
    UserPreferences,
} from '@/src/application/repositories/ISettingsRepository';
import { AuthUser } from '@/src/stores/authStore';

// Mock initial preferences
const MOCK_PREFS: Record<string, UserPreferences> = {
  'user-001': {
    userId: 'user-001',
    language: 'th',
    autoPlay: true,
    showOnline: true,
    notifications: { email: true, push: true, courseReminder: true, promotions: false },
  },
};

export class MockSettingsRepository implements ISettingsRepository {
  async getPreferences(userId: string): Promise<UserPreferences> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return (
      MOCK_PREFS[userId] || {
        userId,
        language: 'th',
        autoPlay: true,
        showOnline: true,
        notifications: { email: true, push: true, courseReminder: true, promotions: false },
      }
    );
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulate updating user data (in reality, backend updates DB)
    // We return the updated AuthUser object
    return {
      id: data.userId,
      name: data.name,
      email: 'current@email.com', // Mock keeping email same
      role: 'student', // Mock keeping role
      avatar: data.avatar || '👤',
      bio: data.bio,
      level: 'Student', // Mock
      joinDate: new Date().toISOString(), // Mock
    } as AuthUser;
  }

  async updatePassword(data: UpdatePasswordData): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate validation
    if (data.current === 'wrong') throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    return true;
  }

  async updatePreferences(data: UserPreferences): Promise<UserPreferences> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    MOCK_PREFS[data.userId] = data;
    return data;
  }
}
