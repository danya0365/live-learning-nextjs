/**
 * SupabaseAchievementRepository
 * Implementation of IAchievementRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 *
 * Joins achievement_definitions + user_achievements to return per-user progress.
 * If a user has no row in user_achievements for a definition, progress defaults to 0.
 *
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
  AchievementCategory,
  AchievementDetail,
  IAchievementRepository,
} from '@/src/application/repositories/IAchievementRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type DefinitionRow = Database['public']['Tables']['achievement_definitions']['Row'];
type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row'];

interface JoinedRow extends DefinitionRow {
  user_achievements: UserAchievementRow[] | null;
}

export class SupabaseAchievementRepository implements IAchievementRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getMyAchievements(): Promise<AchievementDetail[]> {
    // 1. Try to get Active Profile via RPC
    const { data: activeProfiles, error: rpcError } = await this.supabase.rpc('get_active_profile');
    
    if (rpcError || !activeProfiles || activeProfiles.length === 0) {
      return [];
    }

    const activeProfileId = activeProfiles[0].id;
    return this.getByUserId(activeProfileId);
  }

  async getByUserId(userId: string): Promise<AchievementDetail[]> {
    const { data, error } = await this.supabase
      .from('achievement_definitions')
      .select(`
        *,
        user_achievements!left (
          progress,
          unlocked_at
        )
      `)
      .eq('is_active', true)
      .eq('user_achievements.profile_id', userId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return ((data || []) as unknown as JoinedRow[]).map((row) =>
      this.mapToDomain(row, row.user_achievements?.[0] || null)
    );
  }

  async getAll(): Promise<AchievementDetail[]> {
    const { data, error } = await this.supabase
      .from('achievement_definitions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievement definitions:', error);
      return [];
    }

    return (data || []).map((row) => this.mapToDomain(row, null));
  }

  private mapToDomain(
    def: DefinitionRow,
    userAch: Pick<UserAchievementRow, 'progress' | 'unlocked_at'> | null
  ): AchievementDetail {
    return {
      id: def.id,
      icon: def.icon,
      label: def.label,
      description: def.description || '',
      category: def.category as AchievementCategory,
      unlockedAt: userAch?.unlocked_at || null,
      progress: userAch?.progress || 0,
      maxProgress: def.max_progress,
    };
  }
}
