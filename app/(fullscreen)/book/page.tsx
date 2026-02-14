/**
 * Booking Flow Page — Focus Mode
 * Step-by-step wizard: Course → Instructor → Calendar → Confirm
 * Clean, distraction-free UI for booking sessions
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { BookingWizard } from '@/src/presentation/components/booking/BookingWizard';

import BookingSkeleton from '@/src/presentation/components/booking/BookingSkeleton';

export default function BookingPage() {
  return (
    <AuthGuard fallback={<BookingSkeleton />}>
      <BookingWizard />
    </AuthGuard>
  );
}
