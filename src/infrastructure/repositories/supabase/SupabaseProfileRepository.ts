/**
 * SupabaseProfileRepository
 * Implementation of IProfileRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { AuthProfile, AuthUser } from "@/src/application/repositories/IAuthRepository";
import { IProfileRepository } from "@/src/application/repositories/IProfileRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

type ProfileRow = Database['public']['Tables']['profiles']['Row'] & {
  profile_roles?: Database['public']['Tables']['profile_roles']['Row'] | null;
};

export class SupabaseProfileRepository implements IProfileRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private mapUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email || '',
      emailVerified: user.confirmed_at ? true : false,
      phone: user.phone,
      createdAt: user.created_at,
      lastLoginAt: user.last_sign_in_at,
    };
  }

  private mapProfile(row: ProfileRow): AuthProfile {
    // Handle potential array or object return from join
    const roleData = Array.isArray(row.profile_roles) ? row.profile_roles[0] : row.profile_roles;
    const role = roleData?.role || 'student';

    return {
      id: row.id,
      authId: row.auth_id,
      username: row.username || undefined,
      fullName: row.full_name || undefined,
      phone: row.phone || undefined,
      avatarUrl: row.avatar_url || undefined,
      dateOfBirth: row.date_of_birth || undefined,
      gender: (row.gender as any) || undefined,
      address: row.address || undefined,
      bio: row.bio || undefined,
      role: role,
      // Default preferences if null
      preferences: (row.preferences as any) || {
        language: 'th',
        notifications: true,
        theme: 'auto',
      },
      socialLinks: (row.social_links as any) || {},
      verificationStatus: (row.verification_status as any) || 'pending',
      isActive: row.is_active || false,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data } = await this.supabase.auth.getUser();
    if (!data.user) return null;
    return this.mapUser(data.user);
  }

  async getProfiles(): Promise<AuthProfile[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        profile_roles (
          role
        )
      `)
      .eq('auth_id', user.id)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    
    return (data as unknown as ProfileRow[]).map(row => this.mapProfile(row));
  }

  async switchProfile(profileId: string): Promise<boolean> {
     const { data, error } = await this.supabase.rpc('set_profile_active', {
        profile_id: profileId,
     });
     
     if (error) {
        console.error('Failed to switch profile:', error);
        return false;
     }

     // Force refresh session/user metadata
     await this.supabase.auth.refreshSession();
     return data;
  }

  async getProfile(): Promise<AuthProfile | null> {
    // 1. Try to get Active Profile via RPC
    const { data: activeProfiles, error: rpcError } = await this.supabase.rpc('get_active_profile');
    
    if (!rpcError && activeProfiles && activeProfiles.length > 0) {
        const activeId = activeProfiles[0].id;
        
        const { data, error } = await this.supabase
          .from('profiles')
          .select(`
            *,
            profile_roles (
              role
            )
          `)
          .eq('id', activeId)
          .single();
          
        if (!error && data) return this.mapProfile(data as unknown as ProfileRow);
    }
  
    // 2. Fallback: Get ANY profile linked to this user (e.g. if none active)
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        profile_roles (
          role
        )
      `)
      .eq('auth_id', user.id)
      .limit(1);

    if (error || !data || data.length === 0) return null;

    return this.mapProfile(data[0] as unknown as ProfileRow);
  }
}
