import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/src/stores/authStore';

/**
 * A shared hook for Presenters to standardize data loading across the app.
 * 
 * 1. Automatically loads data on mount if no Server-Side initialViewModel was provided.
 * 2. Reactively reloads data whenever the user switches their active profile in the global store.
 */
export function usePresenterInit(
  loadData: () => void | Promise<void>,
  initialViewModel: any
) {
  const { user } = useAuthStore();
  const prevProfileIdRef = useRef(user?.profileId);

  // 1. Initial Data Fetch (Client-side fallback)
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  // 2. Reactive Profile Switch Fetch
  useEffect(() => {
    if (user?.profileId && prevProfileIdRef.current && user.profileId !== prevProfileIdRef.current) {
      loadData();
    }
    prevProfileIdRef.current = user?.profileId;
  }, [user?.profileId, loadData]);
}
