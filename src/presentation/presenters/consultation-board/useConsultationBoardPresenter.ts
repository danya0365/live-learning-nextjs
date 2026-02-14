import { Category, Level } from '@/src/application/repositories/IConfigRepository';
import { ConsultationOffer, ConsultationRequest, CreateConsultationOfferData } from '@/src/application/repositories/IConsultationRepository';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClientConfigPresenter } from '../config/ConfigPresenterClientFactory';
import { ConsultationBoardViewModel } from './ConsultationBoardPresenter';
import { createClientConsultationBoardPresenter } from './ConsultationBoardPresenterClientFactory';

export interface ConsultationBoardState {
  viewModel: ConsultationBoardViewModel | null;
  loading: boolean;
  error: string | null;
  detailLoading: boolean;
  categories: Category[];
  levels: Level[];
  configLoading: boolean;
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
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]); // Add levels state
  const [configLoading, setConfigLoading] = useState(true);
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

  const loadConfig = useCallback(async () => {
    try {
      const configPresenter = createClientConfigPresenter();
      const [cats, lvs] = await Promise.all([
        configPresenter.getCategories(),
        configPresenter.getLevels(),
      ]);
      if (isMountedRef.current) {
        setCategories(cats);
        setLevels(lvs);
      }
    } catch (err) {
      console.error('Failed to load config', err);
    } finally {
      if (isMountedRef.current) setConfigLoading(false);
    }
  }, []);

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
    loadConfig();
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, [loadConfig]);

  return [
    { viewModel, loading, error, detailLoading, categories, levels, configLoading },
    { setCategoryFilter, loadData, loadRequestDetail, submitOffer, withdrawOffer },
  ];
}
