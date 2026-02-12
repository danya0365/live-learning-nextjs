/**
 * Home Page — Role-based routing
 *
 * Not logged in → LandingView (popular courses + CTA)
 * Student       → StudentDashboard (book + join live)
 * Instructor    → InstructorDashboard (teach live + manage schedule)
 */

'use client';

import { InstructorDashboard } from '@/src/presentation/components/dashboard/InstructorDashboard';
import { LandingView } from '@/src/presentation/components/dashboard/LandingView';
import { StudentDashboard } from '@/src/presentation/components/dashboard/StudentDashboard';
import { useAuthStore } from '@/src/stores/authStore';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Prevent flash during hydration
  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-text-muted text-sm">กำลังโหลด...</div>
      </div>
    );
  }

  // Not logged in → Landing
  if (!isAuthenticated || !user) {
    return <LandingView />;
  }

  // Instructor
  if (user.role === 'instructor') {
    return <InstructorDashboard userName={user.name} />;
  }

  // Student (default)
  return <StudentDashboard userName={user.name} />;
}
