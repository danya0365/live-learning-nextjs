/**
 * Zustand Hydration Guard
 * Prevents hydration mismatch by waiting for client-side store rehydration
 * Wrap auth-dependent UI in this to prevent server/client mismatch
 */

'use client';

import { useEffect, useState } from 'react';

interface HydrationGuardProps {
  children: React.ReactNode;
  /** What to show until hydrated (optional) */
  fallback?: React.ReactNode;
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return fallback || null;
  }

  return <>{children}</>;
}
