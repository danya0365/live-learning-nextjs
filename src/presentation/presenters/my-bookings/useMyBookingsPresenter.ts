'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookingFilter, MyBookingsViewModel } from './MyBookingsPresenter';
import { createClientMyBookingsPresenter } from './MyBookingsPresenterClientFactory';

export interface MyBookingsPresenterState {
  viewModel: MyBookingsViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface MyBookingsPresenterActions {
  setFilter: (filter: BookingFilter) => void;
  loadData: () => Promise<void>;
}

import { useAuthStore } from '@/src/stores/authStore';

export function useMyBookingsPresenter(
  initialViewModel?: MyBookingsViewModel,
): [MyBookingsPresenterState, MyBookingsPresenterActions] {
  const presenter = useMemo(() => createClientMyBookingsPresenter(), []);
  const isMountedRef = useRef(true);
  const { user, isInitialized } = useAuthStore();

  const [viewModel, setViewModel] = useState<MyBookingsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<BookingFilter>(initialViewModel?.filter || 'all');

  const loadData = useCallback(async () => {
    if (!isInitialized) return;
    const targetId = user?.profileId || user?.id; // Prefer profileId, fallback to id (Auth UID) which might match in some setups
    if (!targetId) return;

    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(targetId, filter);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, filter, user, isInitialized]);

  const setFilter = useCallback((f: BookingFilter) => {
    setFilterState(f);
  }, []);

  useEffect(() => {
    if (isInitialized && user) {
      loadData();
    }
  }, [filter, isInitialized, user?.profileId, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error },
    { setFilter, loadData },
  ];
}
