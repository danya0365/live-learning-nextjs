'use client';

import { StaticAchievementRepository } from '@/src/infrastructure/repositories/static/StaticAchievementRepository';
import { AchievementsPresenter } from './AchievementsPresenter';

export function createClientAchievementsPresenter(): AchievementsPresenter {
  return new AchievementsPresenter(new StaticAchievementRepository());
}
