'use client';

import { ApiAchievementRepository } from '@/src/infrastructure/repositories/api/ApiAchievementRepository';
import { AchievementsPresenter } from './AchievementsPresenter';

export function createClientAchievementsPresenter(): AchievementsPresenter {
  return new AchievementsPresenter(new ApiAchievementRepository());
}
