'use client';

import { HomeLandingView } from '@/src/presentation/components/home/HomeLandingView';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useAuthStore } from '@/src/stores/authStore';
import { useEffect, useState } from 'react';
import { InstructorHomeView } from './InstructorHomeView';
import { StudentHomeView } from './StudentHomeView';

interface HomeViewProps {
  initialViewModel: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // We still use useHomePresenter for the Landing Page data management (e.g. if we add client-side refresh)
  // but initialViewModel is passed down directly for SSR.
  const [{ viewModel }] = useHomePresenter(initialViewModel);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 1. Client Side & Authenticated: Show Dashboard
  // We only check auth after hydration to ensure server/client HTML match initially
  if (isHydrated && isAuthenticated && user) {
    switch (user.role) {
      case 'student':
        return <StudentHomeView />;
      case 'instructor':
        return <InstructorHomeView />;
    }
  }

  // 2. Server Side (SEO) & Guest: Show Landing Page immediately
  // This ensures Google Bots see the content derived from initialViewModel
  return <HomeLandingView viewModel={viewModel || initialViewModel} />;
}
