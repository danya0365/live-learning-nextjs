/**
 * My Bookings Page — Auth-protected
 * Uses AuthGuard to require login before viewing bookings
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { MyBookingsView } from '@/src/presentation/components/my-bookings/MyBookingsView';

import MyBookingsSkeleton from '@/src/presentation/components/my-bookings/MyBookingsSkeleton';

export default function MyBookingsPage() {
  return (
    <AuthGuard fallback={<MyBookingsSkeleton />}>
      <MyBookingsView />
    </AuthGuard>
  );
}
