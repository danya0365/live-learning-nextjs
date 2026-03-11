'use client';

import { StudentDashboard } from '@/src/presentation/components/dashboard/StudentDashboard';
import StudentDashboardSkeleton from '@/src/presentation/components/dashboard/StudentDashboardSkeleton';
import { useStudentHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useAuthStore } from '@/src/stores/authStore';

export function StudentHomeView() {
  const { user } = useAuthStore();
  const { bookings, loading, error } = useStudentHomePresenter();

  if (!user) return null;

  if (loading && bookings.length === 0) {
    return <StudentDashboardSkeleton />;
  }

  if (error) {
    return <div className="text-error text-center p-4">Error: {error}</div>;
  }

  return <StudentDashboard userName={user.name} bookings={bookings} />;
}
