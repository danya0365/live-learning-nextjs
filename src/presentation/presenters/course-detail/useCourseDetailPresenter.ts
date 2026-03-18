'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CourseDetailViewModel } from './CourseDetailPresenter';
import { createClientCourseDetailPresenter } from './CourseDetailPresenterClientFactory';

export interface CourseDetailPresenterState {
  viewModel: CourseDetailViewModel | null;
  loading: boolean;
  error: string | null;
  isBookingModalOpen: boolean;
  selectedSlotId: string | undefined;
}

export interface CourseDetailPresenterActions {
  loadData: () => Promise<void>;
  openBookingModal: (slotId?: string) => void;
  closeBookingModal: () => void;
  enrollCourse: () => void;
}

export function useCourseDetailPresenter(
  courseId: string,
  initialViewModel?: CourseDetailViewModel,
): CourseDetailPresenterState & CourseDetailPresenterActions {
  const presenter = useMemo(() => createClientCourseDetailPresenter(), []);
  
  const isMountedRef = useRef(true);
  const [viewModel, setViewModel] = useState<CourseDetailViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);

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

  const openBookingModal = useCallback((slotId?: string) => {
    if (viewModel?.enrollment?.status !== 'active') return;
    setSelectedSlotId(slotId);
    setIsBookingModalOpen(true);
  }, [viewModel]);

  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
    setSelectedSlotId(undefined);
  }, []);

  const enrollCourse = useCallback(() => {
    alert('กำลังพัฒนาในเฟสต่อไป');
  }, []);

  return { 
    viewModel, 
    loading, 
    error,
    isBookingModalOpen,
    selectedSlotId,
    loadData,
    openBookingModal,
    closeBookingModal,
    enrollCourse
  };
}
