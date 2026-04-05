/**
 * useContactPresenter
 * Custom hook for Contact presenter
 * Provides state management and actions for Contact operations
 */

'use client';

import { useState, useCallback } from 'react';
import { ContactViewModel, ContactPresenter } from './ContactPresenter';
import { createClientContactPresenter } from './ContactPresenterClientFactory';
import { CreateContactMessageData } from '@/src/application/repositories/IContactRepository';

export interface ContactState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface ContactActions {
  submitForm: (data: CreateContactMessageData) => Promise<void>;
  resetStatus: () => void;
}

export function useContactPresenter(
  initialViewModel?: ContactViewModel,
  presenterOverride?: ContactPresenter
) {
  const [viewModel] = useState<ContactViewModel | undefined>(initialViewModel);
  const [state, setState] = useState<ContactState>({
    loading: false,
    error: null,
    success: false,
  });

  // Use the provided presenter or create a new one
  const presenter = presenterOverride || createClientContactPresenter();

  const submitForm = useCallback(async (data: CreateContactMessageData) => {
    setState((s) => ({ ...s, loading: true, error: null, success: false }));
    try {
      await presenter.sendMessage(data);
      setState({ loading: false, error: null, success: true });
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message || 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง',
        success: false,
      });
    }
  }, [presenter]);

  const resetStatus = useCallback(() => {
    setState((s) => ({ ...s, error: null, success: false }));
  }, []);

  return {
    viewModel,
    state,
    actions: {
      submitForm,
      resetStatus,
    },
  };
}
