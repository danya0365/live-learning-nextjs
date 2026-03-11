/**
 * SupabaseSettingsRepository
 * Implementation of ISettingsRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    ISettingsRepository,
    UpdatePasswordData,
    UpdateProfileData,
    UserPreferences
} from '@/src/application/repositories/ISettingsRepository';
import { Database } from '@/src/domain/types/supabase';
import { AuthUser } from '@/src/stores/authStore';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseSettingsRepository implements ISettingsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getPreferences(userId: string): Promise<UserPreferences> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    if (error || !data) {
        return this.getDefaultPreferences(userId);
    }

    return { ...this.getDefaultPreferences(userId), ...(data.preferences as any) };
  }

  private getDefaultPreferences(userId: string): UserPreferences {
    return {
        userId,
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

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const { data: updated, error } = await this.supabase
      .from('profiles')
      .update({
          full_name: data.name,
          bio: data.bio,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString()
      })
      .eq('id', data.userId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!updated) throw new Error('User not found');
    
    // Get user email & metadata (Required for mapping to AuthUser domain)
    const { data: { user } } = await this.supabase.auth.getUser();

    return {
        id: updated.id,
        email: user?.email || '',
        name: updated.full_name || '',
        avatar: updated.avatar_url || '',
        role: 'student', // Default role; controller is responsible for context-aware roles
        level: 'Member',
        joinDate: updated.created_at || new Date().toISOString(),
        emailVerified: !!user?.email_confirmed_at
    };
  }

  async updatePassword(data: { userId: string } & UpdatePasswordData): Promise<boolean> {
    // Note: Password update is a special case in Supabase Auth that typically 
    // applies to the current session user. The userId is provided for interface 
    // consistency but actual enforcement is done by Supabase Auth security rules.
    const { error } = await this.supabase.auth.updateUser({
        password: data.new
    });
    
    if (error) throw error;
    return true;
  }

  async updatePreferences(data: UserPreferences): Promise<UserPreferences> {
    const { userId, ...prefs } = data;
    
    const { error } = await this.supabase
      .from('profiles')
      .update({
          preferences: prefs
      })
      .eq('id', userId);

    if (error) throw error;
    return data;
  }
}
