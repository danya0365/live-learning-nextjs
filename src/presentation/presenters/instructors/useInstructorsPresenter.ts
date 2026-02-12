'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InstructorsFilters, InstructorSortOption, InstructorsViewModel } from './InstructorsPresenter';
import { createClientInstructorsPresenter } from './InstructorsPresenterClientFactory';

export interface InstructorsPresenterState {
  viewModel: InstructorsViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface InstructorsPresenterActions {
  loadData: (filters?: Partial<InstructorsFilters>) => Promise<void>;
  setSearch: (search: string) => void;
  setSpecialization: (spec: string | null) => void;
  toggleOnlineOnly: () => void;
  setSort: (sort: InstructorSortOption) => void;
}

export function useInstructorsPresenter(
  initialViewModel?: InstructorsViewModel,
): [InstructorsPresenterState, InstructorsPresenterActions] {
  const presenter = useMemo(() => createClientInstructorsPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<InstructorsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<InstructorsFilters>>({});

  const loadData = useCallback(async (f?: Partial<InstructorsFilters>) => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(f);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter]);

  const setSearch = useCallback((search: string) => {
    const next = { ...filters, search };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setSpecialization = useCallback((spec: string | null) => {
    const next = { ...filters, specialization: spec };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const toggleOnlineOnly = useCallback(() => {
    const next = { ...filters, onlineOnly: !filters.onlineOnly };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setSort = useCallback((sort: InstructorSortOption) => {
    const next = { ...filters, sort };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  useEffect(() => {
    if (!initialViewModel) loadData(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error },
    { loadData, setSearch, setSpecialization, toggleOnlineOnly, setSort },
  ];
}
