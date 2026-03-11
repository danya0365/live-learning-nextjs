/**
 * Consultation Board Page — Instructor's view of open requests (Auth-protected)
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationBoardView } from '@/src/presentation/components/consultation-board/ConsultationBoardView';

import ConsultationsSkeleton from '@/src/presentation/components/consultations/ConsultationsSkeleton';

export default function ConsultationBoardPage() {
  return (
    <AuthGuard fallback={<ConsultationsSkeleton />}>
      <ConsultationBoardView />
    </AuthGuard>
  );
}
