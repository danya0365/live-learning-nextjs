'use client';

import { StudentDashboard } from '@/src/presentation/components/dashboard/StudentDashboard';
import { useStudentHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import { useAuthStore } from '@/src/stores/authStore';

export function StudentHomeView() {
  const { user } = useAuthStore();
  const { bookings, loading, error } = useStudentHomePresenter();

  if (!user) return null;

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error text-center p-4">Error: {error}</div>;
  }

  return <StudentDashboard userName={user.name} bookings={bookings} />;
}
