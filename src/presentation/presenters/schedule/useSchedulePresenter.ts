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
  setMonth: (month: number, year: number) => void;
  toggleShowBookedOnly: () => void;
  toggleShowAvailableOnly: () => void;
  addAvailability: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  deleteAvailability: (id: string) => Promise<boolean>;
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
  const [filters, setFilters] = useState<Partial<ScheduleFilters>>(initialViewModel?.filters || {});

  const loadData = useCallback(async (f?: Partial<ScheduleFilters>) => {
    setLoading(true);
    setError(null);
    try {
      const mergedFilters = { ...filters, ...f };
      const vm = await presenter.getViewModel(mergedFilters);
      if (isMountedRef.current) {
        setViewModel(vm);
        setFilters(vm.filters);
      }
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, filters]);

  // Handle Initial Load & Instructor Context
  useEffect(() => {
    const init = async () => {
        let initialFilters: Partial<ScheduleFilters> = { ...filters };

        if (isInstructor) {
            try {
                const instructorId = await presenter.getCurrentInstructorId();
                if (instructorId) {
                    initialFilters.instructorId = instructorId;
                }
            } catch (error) {
                console.error('Failed to fetch instructor ID', error);
            }
        }

        await loadData(initialFilters);
    };

    if (!initialViewModel) {
      init();
    }
  }, [isInstructor]); // eslint-disable-line react-hooks/exhaustive-deps

  const setInstructor = useCallback((id: string | null) => {
    loadData({ instructorId: id });
  }, [loadData]);

  const setDay = useCallback((day: number | null) => {
    loadData({ dayOfWeek: day });
  }, [loadData]);

  const setMonth = useCallback((month: number, year: number) => {
    loadData({ month, year });
  }, [loadData]);

  const toggleShowBookedOnly = useCallback(() => {
    loadData({ showBookedOnly: !filters.showBookedOnly, showAvailableOnly: false });
  }, [filters, loadData]);

  const toggleShowAvailableOnly = useCallback(() => {
    loadData({ showAvailableOnly: !filters.showAvailableOnly, showBookedOnly: false });
  }, [filters, loadData]);

  const addAvailability = useCallback(async (dayOfWeek: number, startTime: string, endTime: string) => {
    try {
      const success = await presenter.addAvailability(dayOfWeek, startTime, endTime);
      if (success) await loadData();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add availability');
      return false;
    }
  }, [presenter, loadData]);

  const deleteAvailability = useCallback(async (id: string) => {
    try {
      const success = await presenter.deleteAvailability(id);
      if (success) await loadData();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete availability');
      return false;
    }
  }, [presenter, loadData]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error },
    { 
      loadData, 
      setInstructor, 
      setDay, 
      setMonth, 
      toggleShowBookedOnly, 
      toggleShowAvailableOnly,
      addAvailability,
      deleteAvailability
    },
  ];
}
