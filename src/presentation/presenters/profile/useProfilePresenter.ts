'use client';

import { useAuthStore } from '@/src/stores/authStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProfileViewModel } from './ProfilePresenter';
import { createClientProfilePresenter } from './ProfilePresenterClientFactory';
import { usePresenterInit } from '../../hooks/usePresenterInit';

export interface ProfilePresenterState {
  viewModel: ProfileViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useProfilePresenter(
  initialViewModel?: ProfileViewModel,
): ProfilePresenterState & { loadData: () => Promise<void> } {
  const presenter = useMemo(() => createClientProfilePresenter(), []);
  const isMountedRef = useRef(true);
  const { user } = useAuthStore();

  const [viewModel, setViewModel] = useState<ProfileViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Session-based: server resolves auth profile identity, no ID needed
      const vm = await presenter.getViewModel(user?.role);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, user?.role]);

  // Handles initial fetch and reactive profile switching automatically
  usePresenterInit(loadData, initialViewModel);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error, loadData };
}
