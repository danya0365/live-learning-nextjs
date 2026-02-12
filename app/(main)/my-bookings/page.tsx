/**
 * My Bookings Page — Auth-protected
 * Uses AuthGuard to require login before viewing bookings
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { MyBookingsView } from '@/src/presentation/components/my-bookings/MyBookingsView';
import { useMyBookingsPresenter } from '@/src/presentation/presenters/my-bookings/useMyBookingsPresenter';

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <MyBookingsContent />
    </AuthGuard>
  );
}

function MyBookingsContent() {
  const [state] = useMyBookingsPresenter();

  return <MyBookingsView initialViewModel={state.viewModel ?? undefined} />;
}
