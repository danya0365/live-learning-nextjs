/**
 * IAchievementRepository
 * Repository interface for Achievement data access
 * Following Clean Architecture - Application layer
 */

export type AchievementCategory = 'learning' | 'consistency' | 'social' | 'milestone';

export interface AchievementDetail {
  id: string;
  icon: string;
  label: string;
  description: string;
  category: AchievementCategory;
  /** null if locked */
  unlockedAt: string | null;
  /** Current progress toward this achievement */
  progress: number;
  /** Target value to unlock */
  maxProgress: number;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  locked: number;
  completionPercent: number;
}

export interface IAchievementRepository {
  /**
   * Get all achievements for a user (both locked and unlocked)
   */
  getByUserId(userId: string): Promise<AchievementDetail[]>;

  /**
   * Get all available achievements
   */
  getAll(): Promise<AchievementDetail[]>;
}
