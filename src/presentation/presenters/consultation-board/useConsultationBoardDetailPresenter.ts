'use client';

import { ConsultationOffer, ConsultationRequest } from '@/src/application/repositories/IConsultationRepository';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClientConsultationBoardPresenter } from './ConsultationBoardPresenterClientFactory';

export interface OfferFormState {
  message: string;
  offeredPrice: string;
  offeredDate: string;
  offeredStartTime: string;
  offeredEndTime: string;
}

export function useConsultationBoardDetailPresenter(requestId: string) {
  const presenter = useMemo(() => createClientConsultationBoardPresenter(), []);
  
  const [request, setRequest] = useState<ConsultationRequest | null>(null);
  const [offers, setOffers] = useState<ConsultationOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [offerForm, setOfferForm] = useState<OfferFormState>({
    message: '',
    offeredPrice: '',
    offeredDate: '',
    offeredStartTime: '09:00',
    offeredEndTime: '12:00',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await presenter.getRequestDetail(requestId);
      setRequest(detail.request);
      setOffers(detail.offers);
      
      if (detail.request) {
        setOfferForm((prev) => ({
          ...prev,
          offeredDate: detail.request!.preferredDates[0] || '',
          offeredStartTime: detail.request!.preferredTimes[0]?.start || '09:00',
          offeredEndTime: detail.request!.preferredTimes[0]?.end || '12:00',
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [presenter, requestId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const myOffer = offers.find((o) => o.instructorId === 'inst-001'); // Mock instructor ID
  const hasOffered = !!myOffer;

  const submitOffer = async () => {
    if (!request || !offerForm.message || !offerForm.offeredPrice || !offerForm.offeredDate) return;
    setSubmitting(true);
    try {
      await presenter.submitOffer({
        requestId: request.id,
        instructorId: 'inst-001',
        message: offerForm.message,
        offeredPrice: parseInt(offerForm.offeredPrice),
        offeredDate: offerForm.offeredDate,
        offeredStartTime: offerForm.offeredStartTime,
        offeredEndTime: offerForm.offeredEndTime,
      });
      setSubmitted(true);
      setShowForm(false);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const withdrawOffer = async () => {
    if (!myOffer) return;
    setSubmitting(true);
    try {
      await presenter.withdrawOffer(myOffer.id);
      setSubmitted(false);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      request,
      offers,
      loading,
      submitting,
      showForm,
      submitted,
      offerForm,
      myOffer,
      hasOffered,
    },
    actions: {
      setShowForm,
      setOfferForm,
      submitOffer,
      withdrawOffer,
    },
  };
}
