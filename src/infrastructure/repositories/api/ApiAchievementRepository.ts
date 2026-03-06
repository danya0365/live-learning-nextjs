/**
 * ApiAchievementRepository
 * Implements IAchievementRepository using API calls
 *
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    AchievementDetail,
    IAchievementRepository,
} from '@/src/application/repositories/IAchievementRepository';

export class ApiAchievementRepository implements IAchievementRepository {
  private baseUrl = '/api/profiles';

  async getByUserId(userId: string): Promise<AchievementDetail[]> {
    const res = await fetch(`${this.baseUrl}/${userId}/achievements`);
    if (!res.ok) {
      console.error('Failed to fetch achievements');
      return [];
    }
    return res.json();
  }

  async getAll(): Promise<AchievementDetail[]> {
    // Use a "me" endpoint or default userId
    const res = await fetch(`${this.baseUrl}/me/achievements`);
    if (!res.ok) return [];
    return res.json();
  }
}
