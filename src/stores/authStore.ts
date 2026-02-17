/**
 * Auth Store — Zustand + Supabase
 * Manages user authentication state using SupabaseAuthRepository
 */

import { AuthProfile as RepoAuthProfile, AuthSession as RepoAuthSession, AuthUser as RepoAuthUser } from '@/src/application/repositories/IAuthRepository';
import { ApiProfileRepository } from '@/src/infrastructure/repositories/api/ApiProfileRepository';
import { SupabaseAuthRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAuthRepository';
import { createClient, resetClient } from '@/src/infrastructure/supabase/client';
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

// ✅ Use a factory/getter to ensure we always use the current client instance
// This avoids issues with module-level initialization where the client might be stale or not yet ready
const getAuthRepository = () => {
  const supabase = createClient();
  return new SupabaseAuthRepository(supabase);
};

// ✅ Use API Repository for profile operations to avoid connection pool exhaustion
const profileRepository = new ApiProfileRepository();

/* ── Mapper ────────────────────────────────── */

const mapToStoreUser = (repoUser: RepoAuthUser, profile: RepoAuthProfile | null): AuthUser => {
  return {
    id: repoUser.id,
    profileId: profile?.id,
    name: profile?.fullName || profile?.username || repoUser.email.split('@')[0],
    email: repoUser.email,
    avatar: profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || repoUser.email)}&background=random`,
    role: (profile?.role as UserRole) || 'student',
    level: (profile as any)?.level || (profile?.role === 'instructor' ? 'Instructor' : 'Student'), 
    joinDate: profile?.createdAt || repoUser.createdAt,
    bio: profile?.bio,
    emailVerified: repoUser.emailVerified,
  };
};


/* ── Helpers ───────────────────────────────── */

const withTimeout = <T>(promise: Promise<T>, ms: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Connection timed out (${ms}ms)`)), ms)
    )
  ]);
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
      const repo = getAuthRepository();
      
      /**
       * Helper: Process session state
       * Handles auto-logout if profile is missing
       * Fetches available profiles for switching
       */
      const processSession = async (session: RepoAuthSession | null) => {
        // 1. No Session -> Clear State
        if (!session) {
            set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
            return;
        }

        // 2. Session exists but NO Profile -> Auto Logout (User deleted)
        if (!session.profile) {
            console.warn('User has session but no profile (Account deleted?). Logging out...');
            await repo.signOut();
            set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
            return;
        }

        // 3. Valid Session & Profile -> Load full state
        try {
            const storeUser = mapToStoreUser(session.user, session.profile);
            
            // Fetch available profiles for switching
            const profiles = await profileRepository.getProfiles();
            const storeProfiles = profiles.map(p => mapToStoreUser(session.user, p));
            
            set({ 
                user: storeUser, 
                profiles: storeProfiles, 
                isAuthenticated: true, 
                isLoading: false, 
                isInitialized: true 
            });
        } catch (err) {
            console.error('Error processing session:', err);
            // Fallback to logged out state if critical error
            set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
        }
      };

      // A. Initial Check
      const session = await withTimeout(repo.getSession(), 5000).catch(() => null);
      await processSession(session);

      // B. Subscribe to changes
      repo.onAuthStateChange(async (newSession) => {
        // Reset loading state on change? Maybe not needed for silent refresh
        // But for login/logout it's good.
        await processSession(newSession);
      });
      
    } catch (error) {
      console.error('Auth initialization failed', error);
      set({ user: null, profiles: [], isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const repo = getAuthRepository();
      const result = await repo.signIn({ email, password });
      
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
      const repo = getAuthRepository();
      const result = await repo.signUp({ 
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
        
        const repo = getAuthRepository();
        const currentUser = await repo.getCurrentUser();
        // If not already logged in as admin, do login
        if (!currentUser || currentUser.email !== adminEmail) {
            const result = await repo.signIn({ email: adminEmail, password: adminPass });
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
          // ✅ Use API Repository for switching profile
          const success = await withTimeout(profileRepository.switchProfile(profileId), 10000);
          
          if (!success) throw new Error('Failed to switch profile');
          
          // Force refresh logic to update UI immediately
          const repo = getAuthRepository();
          const session = await withTimeout(repo.getSession(), 5000);
          
          if (session) {
             const storeUser = mapToStoreUser(session.user, session.profile);
             set({ user: storeUser, isAuthenticated: true, isLoading: false });
          } else {
             set({ isLoading: false });
          }
      } catch (error) {
          console.error('Switch profile error', error);
          resetClient(); // Force reset connection
          set({ isLoading: false });
      }
  },

  logout: async () => {
    set({ isLoading: true });
    const repo = getAuthRepository();
    await repo.signOut();
    set({ user: null, profiles: [], isAuthenticated: false, isLoading: false });
  },
  
  refreshProfile: async () => {
     const repo = getAuthRepository();
     const session = await repo.getSession();
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
