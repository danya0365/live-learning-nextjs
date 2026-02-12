/**
 * Booking Flow Page — Focus Mode
 * Step-by-step wizard: Course → Instructor → Calendar → Confirm
 * Clean, distraction-free UI for booking sessions
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { BookingWizard } from '@/src/presentation/components/booking/BookingWizard';

export default function BookingPage() {
  return (
    <AuthGuard>
      <BookingWizard />
    </AuthGuard>
  );
}
