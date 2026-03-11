'use client';

import { useAuthStore } from '@/src/stores/authStore';
import { useEffect, useRef } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialize();
      initialized.current = true;
    }
  }, [initialize]);

  return <>{children}</>;
}
