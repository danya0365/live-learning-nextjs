/**
 * MockAchievementRepository
 * Mock implementation with rich demo achievements
 * Following Clean Architecture - Infrastructure layer
 */

import {
    AchievementDetail,
    IAchievementRepository,
} from '@/src/application/repositories/IAchievementRepository';
import { MOCK_ACHIEVEMENTS } from '@/src/data/mock/achievements';

export class MockAchievementRepository implements IAchievementRepository {
  async getMyAchievements(): Promise<AchievementDetail[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...MOCK_ACHIEVEMENTS];
  }

  async getByUserId(_userId: string): Promise<AchievementDetail[]> {
    // Simulate delay
    await new Promise((r) => setTimeout(r, 100));
    return [...MOCK_ACHIEVEMENTS];
  }

  async getAll(): Promise<AchievementDetail[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...MOCK_ACHIEVEMENTS];
  }
}
