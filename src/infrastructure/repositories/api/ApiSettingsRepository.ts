/**
 * ApiSettingsRepository
 * Implements ISettingsRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    ISettingsRepository,
    UpdatePasswordData,
    UpdateProfileData,
    UserPreferences
} from '@/src/application/repositories/ISettingsRepository';
import { AuthUser } from '@/src/stores/authStore';

export class ApiSettingsRepository implements ISettingsRepository {
  private baseUrl = '/api/settings';

  async getPreferences(): Promise<UserPreferences> {
    // Force use of session-based retrieval by not sending userId (or sending empty if API requires it, but better to genericize)
    // Given the previous plan, we strip userId from client call.
    const res = await fetch(`${this.baseUrl}/preferences`);
    if (!res.ok) {
         // Return defaults on error to avoid blocking UI
         return {
            userId: 'me',
            language: 'th',
            autoPlay: false,
            showOnline: true,
            notifications: {
                email: true,
                push: true,
                courseReminder: true,
                promotions: false
            }
        };
    }
    return res.json();
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const { userId, ...payload } = data;
    const res = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  async updatePassword(data: UpdatePasswordData): Promise<boolean> {
    const { userId, ...payload } = data;
    const res = await fetch(`${this.baseUrl}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update password');
    return true;
  }

  async updatePreferences(data: UserPreferences): Promise<UserPreferences> {
    const { userId, ...payload } = data;
    const res = await fetch(`${this.baseUrl}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update preferences');
    return res.json();
  }
}
