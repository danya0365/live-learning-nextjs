/**
 * SupabaseAuthRepository
 * Implementation of IAuthRepository using Supabase Auth
 * Following Clean Architecture - Infrastructure layer
 */

import {
  ActiveSession,
  AuthProfile,
  AuthResult,
  AuthSession,
  AuthUser,
  IAuthRepository,
  OTPSignInData,
  ResetPasswordData,
  SignInData,
  SignUpData,
  UpdatePasswordData,
  UpdateProfileData,
  VerifyOTPData,
} from '@/src/application/repositories/IAuthRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type ProfileRow = Database['public']['Tables']['profiles']['Row'] & {
  profile_roles?: Database['public']['Tables']['profile_roles']['Row'] | null;
};

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================
  // AUTH METHODS
  // ============================================================

  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: this.translateError(error.message),
        };
      }

      // Check if user is created but needs email verification
      const needsEmailVerification = !authData.session && !!authData.user;

      return {
        success: true,
        user: authData.user ? this.mapUser(authData.user) : undefined,
        session: authData.session ? await this.mapSession(authData.session) : undefined,
        needsEmailVerification,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
        message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      };
    }
  }

  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        };
      }

      return {
        success: true,
        user: authData.user ? this.mapUser(authData.user) : undefined,
        session: authData.session ? await this.mapSession(authData.session) : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      };
    }
  }

  async signInWithOTP(data: OTPSignInData): Promise<AuthResult> {
    try {
      // Note: Make sure Phone Auth is enabled in Supabase Console
      const { data: authData, error } = await this.supabase.auth.signInWithOtp({
        phone: data.phone,
        options: {
          channel: (data.channel as 'sms' | 'whatsapp') || 'sms',
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: this.translateError(error.message),
        };
      }

      return {
        success: true,
        needsPhoneVerification: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async verifyOTP(data: VerifyOTPData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await this.supabase.auth.verifyOtp({
        phone: data.phone,
        token: data.token,
        type: 'sms',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'รหัส OTP ไม่ถูกต้อง',
        };
      }

      return {
        success: true,
        user: authData.user ? this.mapUser(authData.user) : undefined,
        session: authData.session ? await this.mapSession(authData.session) : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async signInWithOAuth(provider: 'google' | 'facebook' | 'github' | 'line'): Promise<AuthResult> {
    try {
      // 'line' might need custom provider config or 'oidc'
      const { data: authData, error } = await this.supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: `ไม่สามารถเข้าสู่ระบบด้วย ${provider} ได้`,
        };
      }

      return {
        success: true,
        message: 'Redirecting to provider...',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async signOut(): Promise<AuthResult> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async getSession(): Promise<AuthSession | null> {
    const { data } = await this.supabase.auth.getSession();
    if (!data.session) return null;
    return this.mapSession(data.session);
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
     return data;
  }

  async getProfile(): Promise<AuthProfile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    return this.fetchProfile(user.id);
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthProfile> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (data.username) updatePayload.username = data.username;
    if (data.fullName) updatePayload.full_name = data.fullName;
    if (data.phone) updatePayload.phone = data.phone;
    if (data.avatarUrl) updatePayload.avatar_url = data.avatarUrl;
    if (data.bio) updatePayload.bio = data.bio;
    if (data.dateOfBirth) updatePayload.date_of_birth = data.dateOfBirth;
    if (data.gender) updatePayload.gender = data.gender;
    if (data.address) updatePayload.address = data.address;
    
    // JSON fields handling might need merging logic, but for now simple replacement or merge
    // Assuming simple updates for now
    if (data.preferences) updatePayload.preferences = data.preferences; 
    if (data.socialLinks) updatePayload.social_links = data.socialLinks;

    const { data: updated, error } = await this.supabase
      .from('profiles')
      .update(updatePayload)
      .eq('auth_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) throw new Error('Profile not found');

    return this.mapProfile(updated);
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResult> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined,
    });

    if (error) {
      return { success: false, error: error.message, message: this.translateError(error.message) };
    }
    return { success: true, message: 'ส่งลิงก์เปลี่ยนรหัสผ่านไปทางอีเมลแล้ว' };
  }

  async updatePassword(data: UpdatePasswordData): Promise<AuthResult> {
    const { error } = await this.supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      return { success: false, error: error.message, message: 'ไม่สามารถเปลี่ยนรหัสผ่านได้' };
    }
    return { success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
  }

  async resendEmailVerification(email: string): Promise<AuthResult> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  
  async verifyEmail(token: string): Promise<AuthResult> {
    // Usually handled by Supabase automatically via link
    // But if we need to manually verify token_hash
    const { data, error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
    });
    
    if(error) return { success: false, error: error.message };
    
     return {
        success: true,
        user: data.user ? this.mapUser(data.user) : undefined,
        session: data.session ? await this.mapSession(data.session) : undefined,
      };
  }

  async refreshSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.refreshSession();
    if (error || !data.session) return null;
    return this.mapSession(data.session);
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const { data } = this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const mappedSession = await this.mapSession(session);
        callback(mappedSession);
      } else {
        callback(null);
      }
    });

    return () => data.subscription.unsubscribe();
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    const { data, error } = await this.supabase.rpc('get_my_sessions');
    if (error) {
      console.error('Failed to get active sessions from Supabase RPC:', error);
      return [];
    }

    return (data as any[]).map(row => ({
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userAgent: row.user_agent,
      ip: row.ip,
    }));
  }

  async revokeOtherSessions(): Promise<boolean> {
    const { error } = await this.supabase.auth.signOut({ scope: 'others' });
    if (error) {
      console.error('Failed to revoke other sessions:', error);
      return false;
    }
    return true;
  }

  // ============================================================
  // HELPERS & MAPPERS
  // ============================================================

  private async mapSession(session: any): Promise<AuthSession> {
    const user = this.mapUser(session.user);
    const profile = await this.fetchProfile(user.id);
    
    return {
      user,
      profile,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at || 0,
    };
  }

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

  private async fetchProfile(authId: string): Promise<AuthProfile | null> {
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
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        profile_roles (
          role
        )
      `)
      .eq('auth_id', authId)
      .limit(1);

    if (error || !data || data.length === 0) return null;

    return this.mapProfile(data[0] as unknown as ProfileRow);
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

  private translateError(message: string): string {
    if (message.includes('Invalid login credentials')) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    if (message.includes('Email not confirmed')) return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ';
    if (message.includes('User already registered')) return 'อีเมลนี้ถูกลงทะเบียนแล้ว';
    if (message.includes('Password should be at least')) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    return message;
  }
}
