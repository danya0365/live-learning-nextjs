'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProfileViewModel } from './ProfilePresenter';
import { createClientProfilePresenter } from './ProfilePresenterClientFactory';

export interface ProfilePresenterState {
  viewModel: ProfileViewModel | null;
  loading: boolean;
  error: string | null;
}

const DEMO_STUDENT_ID = 'student-001';

export function useProfilePresenter(
  initialViewModel?: ProfileViewModel,
): ProfilePresenterState & { loadData: () => Promise<void> } {
  const presenter = useMemo(() => createClientProfilePresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<ProfileViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(DEMO_STUDENT_ID);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error, loadData };
}
