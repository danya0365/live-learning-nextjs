'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InstructorDetailViewModel } from './InstructorDetailPresenter';
import { createClientInstructorDetailPresenter } from './InstructorDetailPresenterClientFactory';

export interface InstructorDetailPresenterState {
  viewModel: InstructorDetailViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useInstructorDetailPresenter(
  instructorId: string,
  initialViewModel?: InstructorDetailViewModel,
): InstructorDetailPresenterState {
  const presenter = useMemo(() => createClientInstructorDetailPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<InstructorDetailViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(instructorId);
      if (isMountedRef.current) {
        if (vm) setViewModel(vm);
        else setError('ไม่พบอาจารย์ท่านนี้');
      }
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, instructorId]);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, [instructorId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return { viewModel, loading, error };
}
