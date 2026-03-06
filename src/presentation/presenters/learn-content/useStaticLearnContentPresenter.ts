"use client";

import { useMemo } from "react";
import { StaticLearnContentPresenter } from "./StaticLearnContentPresenter";
import { createClientStaticLearnContentPresenter } from "./StaticLearnContentPresenterClientFactory";

/**
 * Custom hook for StaticLearnContent presenter
 * Provides access to the static data fetcher for Client Components
 */
export function useStaticLearnContentPresenter(
  presenterOverride?: StaticLearnContentPresenter
): StaticLearnContentPresenter {
  // Create presenter inside hook with useMemo
  // Accept override for easier testing (Dependency Injection)
  const presenter = useMemo(
    () => presenterOverride ?? createClientStaticLearnContentPresenter(),
    [presenterOverride]
  );
  
  return presenter;
}
