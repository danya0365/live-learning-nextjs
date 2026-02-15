/**
 * AuthGuard — Protects pages that require authentication
 * Redirects to login page if not authenticated
 * Waits for auth store initialization (session restore) before deciding
 */

'use client';

import { useAuthStore } from '@/src/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Optional list of roles allowed to access this page */
  allowedRoles?: string[];
  /** Optional fallback while loading */
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  useEffect(() => {
    // Don't redirect until the store has finished restoring the session
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  // Auth store still initializing (restoring session) — show skeleton
  if (!isInitialized) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Not authenticated — will redirect, show skeleton
  if (!isAuthenticated) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Role mismatch
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return fallback || <AuthGuardSkeleton />;
  }

  return <>{children}</>;
}

function AuthGuardSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <div className="text-4xl animate-bounce mb-4">🔐</div>
        <p className="text-text-muted text-sm">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    </div>
  );
}

