import { AuthProfile } from '@/src/application/repositories/IAuthRepository';
import { IProfileRepository } from '@/src/application/repositories/IProfileRepository';

import {
  MOCK_AUTH_PROFILES
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

}
