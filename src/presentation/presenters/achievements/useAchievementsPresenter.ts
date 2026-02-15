'use client';

import { useAuthStore } from '@/src/stores/authStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AchievementsViewModel } from './AchievementsPresenter';
import { createClientAchievementsPresenter } from './AchievementsPresenterClientFactory';

export interface AchievementsPresenterState {
  viewModel: AchievementsViewModel | null;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

export function useAchievementsPresenter(
  initialViewModel?: AchievementsViewModel,
): AchievementsPresenterState {
  const presenter = useMemo(() => createClientAchievementsPresenter(), []);
  const { user } = useAuthStore();
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<AchievementsViewModel | null>(initialViewModel ?? null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const userId = user?.profileId || user?.id;
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(userId);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, user?.profileId, user?.id]);

  useEffect(() => {
    if (!initialViewModel && (user?.profileId || user?.id)) loadData();
  }, [initialViewModel, loadData, user?.profileId, user?.id]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { viewModel, loading, error, loadData };
}
