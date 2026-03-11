/**
 * AchievementsPresenter
 * Business logic for the Achievements page
 * Receives repository via dependency injection
 */

import {
    AchievementCategory,
    AchievementDetail,
    AchievementStats,
    IAchievementRepository,
} from '@/src/application/repositories/IAchievementRepository';

export interface AchievementsViewModel {
  achievements: AchievementDetail[];
  stats: AchievementStats;
  categories: AchievementCategory[];
}

export class AchievementsPresenter {
  constructor(private readonly repository: IAchievementRepository) {}

  async getViewModel(userId: string): Promise<AchievementsViewModel> {
    const achievements = await this.repository.getByUserId(userId);

    const unlocked = achievements.filter((a) => a.unlockedAt !== null).length;
    const total = achievements.length;

    const stats: AchievementStats = {
      total,
      unlocked,
      locked: total - unlocked,
      completionPercent: total > 0 ? Math.round((unlocked / total) * 100) : 0,
    };

    const categoriesSet = new Set(achievements.map((a) => a.category));
    const categories = Array.from(categoriesSet);

    return { achievements, stats, categories };
  }
}
