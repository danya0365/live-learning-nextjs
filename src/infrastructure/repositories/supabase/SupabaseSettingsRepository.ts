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
        // Return defaults if not found
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

    // Merge with defaults to ensure structure
    const defaults = {
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

    return { ...defaults, ...(data.preferences as any) };
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
    
    // Get user email
    const { data: { user } } = await this.supabase.auth.getUser();
    
    return {
        id: updated.id,
        email: user?.email || '',
        name: updated.full_name || '',
        avatar: updated.avatar_url || '',
        role: 'student', // Placeholder, ideally fetch role
        level: 'Member',
        joinDate: updated.created_at || new Date().toISOString(),
        emailVerified: !!user?.email_confirmed_at
    };
  }

  async updatePassword(data: UpdatePasswordData): Promise<boolean> {
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
