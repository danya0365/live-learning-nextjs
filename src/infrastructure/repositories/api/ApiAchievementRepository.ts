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
  private baseUrl = '/api/achievements';

  async getMyAchievements(): Promise<AchievementDetail[]> {
    const res = await fetch(`${this.baseUrl}/me`);
    if (!res.ok) {
      console.error('Failed to fetch my achievements');
      return [];
    }
    return res.json();
  }

  async getByUserId(userId: string): Promise<AchievementDetail[]> {
    const res = await fetch(`${this.baseUrl}/${userId}`);
    if (!res.ok) {
      console.error('Failed to fetch achievements');
      return [];
    }
    return res.json();
  }

  async getAll(): Promise<AchievementDetail[]> {
    // Use a "me" endpoint or default userId
    const res = await fetch(`${this.baseUrl}/me`);
    if (!res.ok) return [];
    return res.json();
  }
}
