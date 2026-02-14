'use client';

import { ConsultationOffer, ConsultationRequest } from '@/src/application/repositories/IConsultationRepository';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClientConsultationsPresenter } from './ConsultationsPresenterClientFactory';

export interface ConsultationDetailState {
  request: ConsultationRequest | null;
  offers: ConsultationOffer[];
  loading: boolean;
  actionLoading: string | null; // offerId or 'cancel'
  error: string | null;
}

export interface ConsultationDetailActions {
  loadData: () => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
  cancelRequest: () => Promise<void>;
}

export function useConsultationDetailPresenter(requestId: string) {
  const presenter = useMemo(() => createClientConsultationsPresenter(), []);

  const [request, setRequest] = useState<ConsultationRequest | null>(null);
  const [offers, setOffers] = useState<ConsultationOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const detail = await presenter.getRequestDetail(requestId);
      setRequest(detail.request);
      setOffers(detail.offers);
    } catch (err: any) {
      setError(err.message || 'Failed to load consultation details');
    } finally {
      setLoading(false);
    }
  }, [presenter, requestId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const acceptOffer = useCallback(async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await presenter.acceptOffer(offerId);
      await loadData(); // Reload to refresh status
    } catch (err: any) {
      // Handle error (maybe toast)
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [presenter, loadData]);

  const rejectOffer = useCallback(async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await presenter.rejectOffer(offerId);
      await loadData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [presenter, loadData]);

  const cancelRequest = useCallback(async () => {
    if (!request) return;
    setActionLoading('cancel');
    try {
      await presenter.cancelRequest(request.id);
      await loadData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [presenter, request, loadData]);

  return {
    state: { request, offers, loading, actionLoading, error },
    actions: { loadData, acceptOffer, rejectOffer, cancelRequest }
  };
}
