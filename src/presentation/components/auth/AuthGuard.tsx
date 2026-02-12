/**
 * AuthGuard — Protects pages that require authentication
 * Redirects to login page if not authenticated
 * Shows loading spinner during hydration to prevent flash
 */

'use client';

import { useAuthStore } from '@/src/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Optional list of roles allowed to access this page */
  allowedRoles?: string[];
  /** Optional fallback while loading */
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, router]);

  // Still hydrating — show nothing or fallback to prevent flash
  if (!hydrated) {
    return fallback || <AuthGuardSkeleton />;
  }

  // Not authenticated — will redirect, show nothing
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
