'use client';

import { MockAchievementRepository } from '@/src/infrastructure/repositories/mock/MockAchievementRepository';
import { AchievementsPresenter } from './AchievementsPresenter';

export function createClientAchievementsPresenter(): AchievementsPresenter {
  // ⏳ Switch to ApiAchievementRepository when API routes are ready
  return new AchievementsPresenter(new MockAchievementRepository());
}
