'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CategoriesViewModel } from './CategoriesPresenter';
import { createClientCategoriesPresenter } from './CategoriesPresenterClientFactory';

export interface CategoriesPresenterState {
  viewModel: CategoriesViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useCategoriesPresenter(
  initialViewModel?: CategoriesViewModel,
): CategoriesPresenterState & { loadData: () => Promise<void> } {
  const presenter = useMemo(() => createClientCategoriesPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<CategoriesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
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
    if (!initialViewModel) loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error, loadData };
}
