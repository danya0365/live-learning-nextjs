'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScheduleFilters, ScheduleViewModel } from './SchedulePresenter';
import { createClientSchedulePresenter } from './SchedulePresenterClientFactory';

export interface SchedulePresenterState {
  viewModel: ScheduleViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface SchedulePresenterActions {
  loadData: (filters?: Partial<ScheduleFilters>) => Promise<void>;
  setInstructor: (id: string | null) => void;
  setDay: (day: number | null) => void;
  toggleShowBookedOnly: () => void;
  toggleShowAvailableOnly: () => void;
}

export function useSchedulePresenter(
  initialViewModel?: ScheduleViewModel,
): [SchedulePresenterState, SchedulePresenterActions] {
  const presenter = useMemo(() => createClientSchedulePresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<ScheduleViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<ScheduleFilters>>({});

  const loadData = useCallback(async (f?: Partial<ScheduleFilters>) => {
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

  const setInstructor = useCallback((id: string | null) => {
    const next = { ...filters, instructorId: id };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const setDay = useCallback((day: number | null) => {
    const next = { ...filters, dayOfWeek: day };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const toggleShowBookedOnly = useCallback(() => {
    const next = { ...filters, showBookedOnly: !filters.showBookedOnly, showAvailableOnly: false };
    setFilters(next);
    loadData(next);
  }, [filters, loadData]);

  const toggleShowAvailableOnly = useCallback(() => {
    const next = { ...filters, showAvailableOnly: !filters.showAvailableOnly, showBookedOnly: false };
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
    { loadData, setInstructor, setDay, toggleShowBookedOnly, toggleShowAvailableOnly },
  ];
}
