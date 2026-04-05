'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminChatViewModel, AdminChatPresenter } from "./AdminChatPresenter";
import { createClientAdminChatPresenter } from "./AdminChatPresenterClientFactory";

export interface AdminChatPresenterState {
  viewModel: AdminChatViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface AdminChatPresenterActions {
  loadData: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useAdminChatPresenter(
  activeTab: string = "active",
  initialViewModel?: AdminChatViewModel,
  presenterOverride?: AdminChatPresenter
) {
  // 1. Initialize Presenter and State
  const [state, setState] = useState<AdminChatPresenterState>({
    viewModel: initialViewModel || null,
    loading: !initialViewModel,
    error: null,
  });

  const presenter = useMemo(
    () => presenterOverride || createClientAdminChatPresenter(),
    [presenterOverride]
  );

  // 2. Define Actions
  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const viewModel = await presenter.getViewModel(activeTab);
      setState((prev) => ({
        ...prev,
        viewModel,
        loading: false,
      }));
    } catch (error: any) {
      console.error("useAdminChatPresenter: Failed to load data", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load chat data",
      }));
    }
  }, [presenter, activeTab]);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // 3. Effects
  useEffect(() => {
    // If we have an initial view model but the tab changed, we should reload
    if (initialViewModel && initialViewModel.activeTab === activeTab) {
       return;
    }
    loadData();
  }, [loadData, activeTab, initialViewModel]);

  // 4. Return state and actions
  const actions: AdminChatPresenterActions = {
    loadData,
    setError,
  };

  return {
    ...state,
    actions,
  };
}
