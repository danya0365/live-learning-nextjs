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
  /** Optional fallback while loading or redirecting */
  fallback?: React.ReactNode;
  /** Optional fallback specifically for when the user is logged in but lacks the required role */
  unauthorizedFallback?: React.ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback, unauthorizedFallback }: AuthGuardProps) {
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
      // Only redirect if there is no custom unauthorized UI provided
      if (!unauthorizedFallback) {
        router.replace('/');
      }
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router, unauthorizedFallback]);

  // Auth store still initializing (restoring session) — show skeleton
  if (!isInitialized) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Not authenticated — will redirect, show loading fallback
  if (!isAuthenticated) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Role mismatch - Show unauthorized fallback if provided, otherwise generic fallback
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return unauthorizedFallback || fallback || <AuthGuardSkeleton />;
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

