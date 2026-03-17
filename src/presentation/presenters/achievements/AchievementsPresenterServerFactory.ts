import { SupabaseAchievementRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAchievementRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { AchievementsPresenter } from './AchievementsPresenter';

export class AchievementsPresenterServerFactory {
  static async create(): Promise<AchievementsPresenter> {
    const supabase = await createServerSupabaseClient();
    return new AchievementsPresenter(new SupabaseAchievementRepository(supabase));
  }
}

export async function createServerAchievementsPresenter(): Promise<AchievementsPresenter> {
  return AchievementsPresenterServerFactory.create();
}
