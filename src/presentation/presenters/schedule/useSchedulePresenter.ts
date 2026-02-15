'use client';

import { useAuthStore } from '@/src/stores/authStore';
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
  const { user } = useAuthStore();
  const isInstructor = user?.role === 'instructor';
  
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

  // Handle Initial Load & Instructor Context
  useEffect(() => {
    if (initialViewModel) return;

    const init = async () => {
        let initialFilters: Partial<ScheduleFilters> = { ...filters };

        if (isInstructor) {
            try {
                const instructorId = await presenter.getCurrentInstructorId();
                if (instructorId) {
                    initialFilters.instructorId = instructorId;
                    setFilters(prev => ({ ...prev, instructorId }));
                }
            } catch (error) {
                console.error('Failed to fetch instructor ID', error);
            }
        }

        await loadData(initialFilters);
    };

    init();
  }, [isInstructor]); // eslint-disable-line react-hooks/exhaustive-deps

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
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error },
    { loadData, setInstructor, setDay, toggleShowBookedOnly, toggleShowAvailableOnly },
  ];
}
