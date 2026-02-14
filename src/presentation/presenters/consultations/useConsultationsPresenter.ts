'use client';

import { ConsultationOffer, ConsultationRequest } from '@/src/application/repositories/IConsultationRepository';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConsultationFilter, ConsultationsViewModel } from './ConsultationsPresenter';
import { createClientConsultationsPresenter } from './ConsultationsPresenterClientFactory';

export interface ConsultationsState {
  viewModel: ConsultationsViewModel | null;
  loading: boolean;
  error: string | null;
  detailLoading: boolean;
}

export interface ConsultationsActions {
  setFilter: (filter: ConsultationFilter) => void;
  loadData: () => Promise<void>;
  loadRequestDetail: (requestId: string) => Promise<{ request: ConsultationRequest | null; offers: ConsultationOffer[] }>;
  acceptOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
}

const DEMO_STUDENT_ID = 'student-001';

export function useConsultationsPresenter(
  initialViewModel?: ConsultationsViewModel,
): [ConsultationsState, ConsultationsActions] {
  const presenter = useMemo(() => createClientConsultationsPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<ConsultationsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<ConsultationFilter>(initialViewModel?.filter || 'all');
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(DEMO_STUDENT_ID, filter);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, filter]);

  const setFilter = useCallback((f: ConsultationFilter) => {
    setFilterState(f);
  }, []);

  const loadRequestDetail = useCallback(async (requestId: string) => {
    setDetailLoading(true);
    try {
      const detail = await presenter.getRequestDetail(requestId);
      return detail;
    } finally {
      if (isMountedRef.current) setDetailLoading(false);
    }
  }, [presenter]);

  const acceptOffer = useCallback(async (offerId: string) => {
    await presenter.acceptOffer(offerId);
    await loadData();
  }, [presenter, loadData]);

  const rejectOffer = useCallback(async (offerId: string) => {
    await presenter.rejectOffer(offerId);
    await loadData();
  }, [presenter, loadData]);

  const cancelRequest = useCallback(async (requestId: string) => {
    await presenter.cancelRequest(requestId);
    await loadData();
  }, [presenter, loadData]);

  useEffect(() => {
    loadData();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error, detailLoading },
    { setFilter, loadData, loadRequestDetail, acceptOffer, rejectOffer, cancelRequest },
  ];
}
