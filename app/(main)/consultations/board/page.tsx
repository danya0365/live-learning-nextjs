/**
 * Consultation Board Page — Instructor's view of open requests (Auth-protected)
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationBoardView } from '@/src/presentation/components/consultation-board/ConsultationBoardView';

export default function ConsultationBoardPage() {
  return (
    <AuthGuard>
      <ConsultationBoardView />
    </AuthGuard>
  );
}
