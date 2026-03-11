/**
 * StaticAchievementRepository
 * Static implementation — read-only from static data files
 * Following Clean Architecture - Infrastructure layer
 */

import {
    AchievementDetail,
    IAchievementRepository,
} from '@/src/application/repositories/IAchievementRepository';
import { MOCK_ACHIEVEMENTS } from '@/src/data/mock/achievements';

export class StaticAchievementRepository implements IAchievementRepository {
  async getMyAchievements(): Promise<AchievementDetail[]> {
    return [...MOCK_ACHIEVEMENTS];
  }

  async getByUserId(_userId: string): Promise<AchievementDetail[]> {
    return [...MOCK_ACHIEVEMENTS];
  }

  async getAll(): Promise<AchievementDetail[]> {
    return [...MOCK_ACHIEVEMENTS];
  }
}
