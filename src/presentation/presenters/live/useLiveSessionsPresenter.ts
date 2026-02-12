'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LiveSessionsViewModel } from './LiveSessionsPresenter';
import { createClientLiveSessionsPresenter } from './LiveSessionsPresenterClientFactory';

export interface LiveSessionsPresenterState {
  viewModel: LiveSessionsViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useLiveSessionsPresenter(
  initialViewModel?: LiveSessionsViewModel,
): LiveSessionsPresenterState & { refresh: () => Promise<void> } {
  const presenter = useMemo(() => createClientLiveSessionsPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<LiveSessionsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel();
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error, refresh };
}
