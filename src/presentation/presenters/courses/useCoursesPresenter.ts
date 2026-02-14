'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CoursesFilters, CourseSortOption, CoursesViewModel } from './CoursesPresenter';
import { createClientCoursesPresenter } from './CoursesPresenterClientFactory';

export interface CoursesPresenterState {
  viewModel: CoursesViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface CoursesPresenterActions {
  loadData: (filters?: Partial<CoursesFilters>) => Promise<void>;
  setCategory: (categoryId: string | null) => void;
  setLevel: (level: string | null) => void;
  setSearch: (search: string) => void;
  setSort: (sort: CourseSortOption) => void;
}

export function useCoursesPresenter(
  initialViewModel?: CoursesViewModel,
): [CoursesPresenterState, CoursesPresenterActions] {
  const presenter = useMemo(() => createClientCoursesPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<CoursesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<CoursesFilters>>({});

  const loadData = useCallback(async (f?: Partial<CoursesFilters>) => {
    setLoading(true);
    setError(null);
    const filtersToUse = f || filters;
    try {
      const vm = await presenter.getViewModel(filtersToUse);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, filters]);

  const setCategory = useCallback((categoryId: string | null) => {
    const next = { ...filters, categoryId };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setLevel = useCallback((level: string | null) => {
    const next = { ...filters, level };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setSearch = useCallback((search: string) => {
    const next = { ...filters, search };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setSort = useCallback((sort: CourseSortOption) => {
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
    { loadData, setCategory, setLevel, setSearch, setSort },
  ];
}
