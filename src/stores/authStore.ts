/**
 * Auth Store — Zustand + Supabase
 * Manages user authentication state using SupabaseAuthRepository
 */

import { AuthProfile as RepoAuthProfile, AuthUser as RepoAuthUser } from '@/src/application/repositories/IAuthRepository';
import { SupabaseAuthRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAuthRepository';
import { createClient } from '@/src/infrastructure/supabase/client';
import { create } from 'zustand';

/* ── Types ─────────────────────────────────── */

export type UserRole = 'student' | 'instructor' | 'admin';

export interface AuthUser {
  id: string; // Auth ID
  profileId?: string; // Profile ID (for switching)
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  level: string;
  joinDate: string;
  bio?: string;
  emailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  profiles: AuthUser[]; // Available profiles for switching
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDevAdmin: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  
  updateUser: (user: Partial<AuthUser>) => void;
  refreshProfile: () => Promise<void>;
}

/* ── Demo Accounts ─────────────────────────── */
// Simplified: Just one Dev Admin concept
export const IS_DEV = process.env.NODE_ENV !== 'production';

/* ── Repository Integration ────────────────── */

const supabase = createClient();
const authRepository = new SupabaseAuthRepository(supabase);

/* ── Mapper ────────────────────────────────── */

const mapToStoreUser = (repoUser: RepoAuthUser, profile: RepoAuthProfile | null): AuthUser => {
  return {
    id: repoUser.id,
    profileId: profile?.id,
    name: profile?.fullName || profile?.username || repoUser.email.split('@')[0],
    email: repoUser.email,
    avatar: profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || repoUser.email)}&background=random`,
    role: (profile?.role as UserRole) || 'student',
    level: 'Member', 
    joinDate: profile?.createdAt || repoUser.createdAt,
    bio: profile?.bio,
    emailVerified: repoUser.emailVerified,
  };
};

/* ── Store ─────────────────────────────────── */


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profiles: [],
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const session = await authRepository.getSession();
      
      if (session) {
        const storeUser = mapToStoreUser(session.user, session.profile);
        const profiles = await authRepository.getProfiles();
        const storeProfiles = profiles.map(p => mapToStoreUser(session.user, p));
        
        set({ 
            user: storeUser, 
            profiles: storeProfiles, 
            isAuthenticated: true, 
            isLoading: false, 
            isInitialized: true 
        });
      } else {
        set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
      }

      authRepository.onAuthStateChange(async (session) => {
        if (session) {
          const storeUser = mapToStoreUser(session.user, session.profile);
          const profiles = await authRepository.getProfiles();
          const storeProfiles = profiles.map(p => mapToStoreUser(session.user, p));
          
          set({ user: storeUser, profiles: storeProfiles, isAuthenticated: true, isLoading: false });
        } else {
          set({ user: null, profiles: [], isAuthenticated: false, isLoading: false });
        }
      });
      
    } catch (error) {
      console.error('Auth initialization failed', error);
      set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await authRepository.signIn({ email, password });
      
      if (!result.success) {
        set({ isLoading: false });
        return { success: false, error: result.message || result.error };
      }
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const result = await authRepository.signUp({ 
        email, 
        password, 
        fullName: name 
      });

      set({ isLoading: false });

      if (!result.success) {
        return { success: false, error: result.message || result.error };
      }

      if (result.needsEmailVerification) {
         return { success: true, error: 'กรุณายืนยันอีเมลของคุณเพื่อเข้าใช้งาน' };
      }

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  loginAsDevAdmin: async () => {
      set({ isLoading: true });
      try {
        const adminEmail = 'admin@livelearning.com';
        const adminPass = '12345678';
        
        const currentUser = await authRepository.getCurrentUser();
        // If not already logged in as admin, do login
        if (!currentUser || currentUser.email !== adminEmail) {
            const result = await authRepository.signIn({ email: adminEmail, password: adminPass });
            if (!result.success) throw new Error(result.message || 'Dev Login Failed');
        }
      } catch (error: any) {
          console.error('Dev login error', error);
          set({ isLoading: false });
      }
  },
  
  switchProfile: async (profileId: string) => {
      set({ isLoading: true });
      try {
          const success = await authRepository.switchProfile(profileId);
          if (!success) throw new Error('Failed to switch profile');
      } catch (error) {
          console.error('Switch profile error', error);
          set({ isLoading: false });
      }
  },

  logout: async () => {
    set({ isLoading: true });
    await authRepository.signOut();
    set({ user: null, profiles: [], isAuthenticated: false, isLoading: false });
  },
  
  refreshProfile: async () => {
     const session = await authRepository.getSession();
     if (session) {
        const storeUser = mapToStoreUser(session.user, session.profile);
        set({ user: storeUser });
     }
  },

  updateUser: (data: Partial<AuthUser>) => {
    set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
    }));
  }
}));
