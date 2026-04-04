"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/src/stores/authStore";
import { WalletPresenter, WalletViewModel } from "./WalletPresenter";
import { createClientWalletPresenter } from "./WalletPresenterClientFactory";
import { usePresenterInit } from "../../hooks/usePresenterInit";

export interface WalletPresenterState {
  viewModel: WalletViewModel | null;
  loading: boolean;
  error: string | null;
  isToppingUp: boolean;
}

export interface WalletPresenterActions {
  loadData: () => Promise<void>;
  topUp: (amount: number, description?: string, isTestMode?: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useWalletPresenter(
  initialViewModel?: WalletViewModel,
  presenterOverride?: WalletPresenter
): [WalletPresenterState, WalletPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientWalletPresenter(),
    [presenterOverride]
  );
  
  const isMountedRef = useRef(true);
  
  const [state, setState] = useState<WalletPresenterState>({
    viewModel: initialViewModel ?? null,
    loading: !initialViewModel,
    error: null,
    isToppingUp: false,
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((updates: Partial<WalletPresenterState>) => {
    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const viewModel = await presenter.getViewModel();
      updateState({ viewModel, loading: false });
    } catch (error: any) {
      updateState({ 
        error: error.message || "Failed to load wallet data", 
        loading: false 
      });
    }
  }, [presenter, updateState]);

  // Handles initial fetch and reactive profile switching automatically
  usePresenterInit(loadData, initialViewModel);

  const topUp = useCallback(
    async (amount: number, description?: string, isTestMode?: boolean) => {
      try {
        updateState({ isToppingUp: true, error: null });
        const result = await presenter.topUp(amount, description, isTestMode);
        
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
          return; // Prevent clearing loading state while redirecting
        }
        
        await loadData(); // Reload data after top up (for test mode bypass)
      } catch (error: any) {
        updateState({ error: error.message || "Failed to top up" });
        throw error;
      } finally {
        updateState({ isToppingUp: false });
      }
    },
    [presenter, loadData, updateState]
  );

  const setError = useCallback(
    (error: string | null) => {
      updateState({ error });
    },
    [updateState]
  );

  return [
    state,
    {
      loadData,
      topUp,
      setError,
    },
  ];
}
