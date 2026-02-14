'use client';

import { ConsultationOffer, ConsultationRequest, CreateConsultationOfferData } from '@/src/application/repositories/IConsultationRepository';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConsultationBoardViewModel } from './ConsultationBoardPresenter';
import { createClientConsultationBoardPresenter } from './ConsultationBoardPresenterClientFactory';

export interface ConsultationBoardState {
  viewModel: ConsultationBoardViewModel | null;
  loading: boolean;
  error: string | null;
  detailLoading: boolean;
}

export interface ConsultationBoardActions {
  setCategoryFilter: (categoryId: string | null) => void;
  loadData: () => Promise<void>;
  loadRequestDetail: (requestId: string) => Promise<{ request: ConsultationRequest | null; offers: ConsultationOffer[] }>;
  submitOffer: (data: CreateConsultationOfferData) => Promise<void>;
  withdrawOffer: (offerId: string) => Promise<void>;
}

const DEMO_INSTRUCTOR_ID = 'inst-001';

export function useConsultationBoardPresenter(
  initialViewModel?: ConsultationBoardViewModel,
): [ConsultationBoardState, ConsultationBoardActions] {
  const presenter = useMemo(() => createClientConsultationBoardPresenter(), []);
  const isMountedRef = useRef(true);

  const [viewModel, setViewModel] = useState<ConsultationBoardViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(initialViewModel?.selectedCategoryId || null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(DEMO_INSTRUCTOR_ID, categoryId);
      if (isMountedRef.current) setViewModel(vm);
    } catch (err) {
      if (isMountedRef.current) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter, categoryId]);

  const setCategoryFilter = useCallback((id: string | null) => {
    setCategoryId(id);
  }, []);

  const loadRequestDetail = useCallback(async (requestId: string) => {
    setDetailLoading(true);
    try {
      return await presenter.getRequestDetail(requestId);
    } finally {
      if (isMountedRef.current) setDetailLoading(false);
    }
  }, [presenter]);

  const submitOffer = useCallback(async (data: CreateConsultationOfferData) => {
    await presenter.submitOffer(data);
    await loadData();
  }, [presenter, loadData]);

  const withdrawOffer = useCallback(async (offerId: string) => {
    await presenter.withdrawOffer(offerId);
    await loadData();
  }, [presenter, loadData]);

  useEffect(() => {
    loadData();
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  return [
    { viewModel, loading, error, detailLoading },
    { setCategoryFilter, loadData, loadRequestDetail, submitOffer, withdrawOffer },
  ];
}
