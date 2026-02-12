'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CourseDetailViewModel } from './CourseDetailPresenter';
import { createClientCourseDetailPresenter } from './CourseDetailPresenterClientFactory';

export interface CourseDetailPresenterState {
  viewModel: CourseDetailViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useCourseDetailPresenter(
  courseId: string,
  initialViewModel?: CourseDetailViewModel,
): CourseDetailPresenterState {
  const presenter = useMemo(() => createClientCourseDetailPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<CourseDetailViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(courseId);
      if (isMountedRef.current) {
        if (vm) setViewModel(vm);
        else setError('ไม่พบคอร์สนี้');
      }
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, courseId]);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error };
}
