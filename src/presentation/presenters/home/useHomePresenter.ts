/**
 * Home Hooks
 * Custom hooks for Home page state management
 * Following Clean Architecture presenter pattern
 * 
 * Includes:
 * - useHomePresenter: Base logic (Landing/Guest)
 * - useStudentHomePresenter: Student logic
 * - useInstructorHomePresenter: Instructor logic
 */

'use client';

import { Booking } from '@/src/application/repositories/IBookingRepository';
import { useAuthStore } from '@/src/stores/authStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HomePresenter, HomeViewModel } from './HomePresenter';
import { createClientHomePresenter } from './HomePresenterClientFactory';

/* -------------------------------------------------------------------------- */
/*                               Base / Guest Hook                            */
/* -------------------------------------------------------------------------- */

export interface HomePresenterState {
  viewModel: HomeViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface HomePresenterActions {
  loadData: () => Promise<void>;
}

export function useHomePresenter(
  initialViewModel?: HomeViewModel,
  presenterOverride?: HomePresenter,
): [HomePresenterState, HomePresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientHomePresenter(),
    [presenterOverride],
  );

  const isMountedRef = useRef(true);
  
  // Initialize with passed server state if available
  const [viewModel, setViewModel] = useState<HomeViewModel | null>(
    initialViewModel || null,
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newViewModel = await presenter.getViewModel();
      if (isMountedRef.current) {
        setViewModel(newViewModel);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading home data:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [presenter]);

  // Load data if not initialized
  useEffect(() => {
    if (!initialViewModel && !viewModel) {
      loadData();
    }
  }, [loadData, initialViewModel, viewModel]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return [
    { viewModel, loading, error },
    { loadData },
  ];
}


/* -------------------------------------------------------------------------- */
/*                               Student Hook                                 */
/* -------------------------------------------------------------------------- */

export interface StudentHomeState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

export function useStudentHomePresenter(
  presenterOverride?: HomePresenter,
): StudentHomeState {
  const { user } = useAuthStore();
  const presenter = useMemo(
    () => presenterOverride ?? createClientHomePresenter(),
    [presenterOverride],
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Flag to prevent race conditions and state updates on unmounted component
    let isCancelled = false;

    const fetchStudentData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fallback to demo ID if needed
        const targetId = user.id.startsWith('user-') ? 'student-001' : user.id;
        const data = await presenter.getStudentDashboardData(targetId);
        
        if (!isCancelled) {
          setBookings(data.bookings);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching student data:', err);
          setError('Failed to load student dashboard');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchStudentData();

    return () => {
      isCancelled = true;
    };
  }, [user, presenter]);

  return { bookings, loading, error };
}

/* -------------------------------------------------------------------------- */
/*                               Instructor Hook                              */
/* -------------------------------------------------------------------------- */

export interface InstructorHomeState {
  schedule: Booking[];
  loading: boolean;
  error: string | null;
}

export function useInstructorHomePresenter(
  presenterOverride?: HomePresenter,
): InstructorHomeState {
  const { user } = useAuthStore();
  const presenter = useMemo(
    () => presenterOverride ?? createClientHomePresenter(),
    [presenterOverride],
  );

  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchInstructorData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fallback to demo ID if needed
        const targetId = user.id.startsWith('user-') ? 'inst-001' : user.id;
        const data = await presenter.getInstructorDashboardData(targetId);
        
        if (!isCancelled) {
          setSchedule(data.schedule);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching instructor data:', err);
          setError('Failed to load instructor dashboard');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInstructorData();

    return () => {
      isCancelled = true;
    };
  }, [user, presenter]);

  return { schedule, loading, error };
}
