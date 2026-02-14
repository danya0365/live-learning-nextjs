'use client';

import { InstructorDashboard } from '@/src/presentation/components/dashboard/InstructorDashboard';
import InstructorDashboardSkeleton from '@/src/presentation/components/dashboard/InstructorDashboardSkeleton';
import { useInstructorHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useAuthStore } from '@/src/stores/authStore';

export function InstructorHomeView() {
  const { user } = useAuthStore();
  const { schedule, loading, error } = useInstructorHomePresenter();

  if (!user) return null;

  if (loading && schedule.length === 0) {
    return <InstructorDashboardSkeleton />;
  }

  if (error) {
    return <div className="text-error text-center p-4">Error: {error}</div>;
  }

  return <InstructorDashboard userName={user.name} schedule={schedule} />;
}
