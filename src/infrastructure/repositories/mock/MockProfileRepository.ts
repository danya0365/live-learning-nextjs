import { AuthProfile } from '@/src/application/repositories/IAuthRepository';
import { Achievement, IProfileRepository } from '@/src/application/repositories/IProfileRepository';

import {
    ADMIN_ACHIEVEMENTS,
    DEMO_ACHIEVEMENTS,
    INSTRUCTOR_ACHIEVEMENTS,
    MOCK_AUTH_PROFILES,
} from '@/src/data/mock/profiles';

export class MockProfileRepository implements IProfileRepository {
  async getProfile(): Promise<AuthProfile | null> {
    return MOCK_AUTH_PROFILES['student-001'] || null;
  }

  async getById(id: string): Promise<AuthProfile | null> {
    return MOCK_AUTH_PROFILES[id] || MOCK_AUTH_PROFILES['student-001'] || null;
  }

  async getProfiles(): Promise<AuthProfile[]> {
      return Object.values(MOCK_AUTH_PROFILES);
  }

  async switchProfile(profileId: string): Promise<boolean> {
      return true;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    if (userId === 'instructor-001') {
      return [...INSTRUCTOR_ACHIEVEMENTS];
    }
    if (userId === 'admin-001') {
      return [...ADMIN_ACHIEVEMENTS];
    }
    return [...DEMO_ACHIEVEMENTS];
  }
}
