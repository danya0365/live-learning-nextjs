/**
 * Auth Store — Zustand + localStorage persistence
 * Manages user authentication state across the app
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ── Types ─────────────────────────────────── */

export type UserRole = 'student' | 'instructor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  level: string;
  joinDate: string;
  bio?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (accountKey: DemoAccountKey) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: AuthUser) => void;
}

/* ── Demo accounts ─────────────────────────── */

export type DemoAccountKey = 'student' | 'instructor' | 'admin';

export const DEMO_ACCOUNTS: Record<DemoAccountKey, { user: AuthUser; password: string }> = {
  student: {
    user: {
      id: 'student-001',
      name: 'น้องมิน',
      email: 'min@demo.com',
      avatar: '🧑‍💻',
      role: 'student',
      level: 'Intermediate',
      joinDate: '2025-09-15',
    },
    password: 'demo1234',
  },
  instructor: {
    user: {
      id: 'instructor-001',
      name: 'อ.สมชาย',
      email: 'somchai@demo.com',
      avatar: '👨‍🏫',
      role: 'instructor',
      level: 'Expert',
      joinDate: '2024-03-01',
    },
    password: 'demo1234',
  },
  admin: {
    user: {
      id: 'admin-001',
      name: 'แอดมิน',
      email: 'admin@demo.com',
      avatar: '🛡️',
      role: 'admin',
      level: 'Master',
      joinDate: '2024-01-01',
    },
    password: 'demo1234',
  },
};

/* ── Registered users simulation (in-memory) ── */

const registeredUsers: Map<string, { user: AuthUser; password: string }> = new Map();

// Pre-populate with demo accounts
Object.values(DEMO_ACCOUNTS).forEach((account) => {
  registeredUsers.set(account.user.email, account);
});

/* ── Store ─────────────────────────────────── */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 800));

        const account = registeredUsers.get(email.toLowerCase());
        if (!account) {
          set({ isLoading: false });
          return { success: false, error: 'ไม่พบบัญชีนี้ กรุณาตรวจสอบอีเมล' };
        }
        if (account.password !== password) {
          set({ isLoading: false });
          return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
        }

        set({ user: account.user, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });

        await new Promise((r) => setTimeout(r, 1000));

        const emailLower = email.toLowerCase();
        if (registeredUsers.has(emailLower)) {
          set({ isLoading: false });
          return { success: false, error: 'อีเมลนี้ถูกใช้แล้ว' };
        }

        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name,
          email: emailLower,
          avatar: '🧑‍🎓',
          role: 'student',
          level: 'Beginner',
          joinDate: new Date().toISOString().split('T')[0],
        };

        registeredUsers.set(emailLower, { user: newUser, password });
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      loginAsDemo: (accountKey: DemoAccountKey) => {
        const account = DEMO_ACCOUNTS[accountKey];
        set({ user: account.user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (user: AuthUser) => {
        set({ user });
      },
    }),
    {
      name: 'live-learning-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
