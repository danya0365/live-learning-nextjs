/**
 * Consultation Board Page — Instructor's view of open requests (Auth-protected)
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { UnauthorizedAccessView } from '@/src/presentation/components/auth/UnauthorizedAccessView';
import { ConsultationBoardView } from '@/src/presentation/components/consultation-board/ConsultationBoardView';

import ConsultationsSkeleton from '@/src/presentation/components/consultations/ConsultationsSkeleton';

export default function ConsultationBoardPage() {
  return (
    <AuthGuard 
      fallback={<ConsultationsSkeleton />}
      allowedRoles={['instructor']}
      unauthorizedFallback={<UnauthorizedAccessView message="หน้านี้สงวนสิทธิ์เฉพาะโปรไฟล์ประเภทผู้สอน (Instructor) เท่านั้น" />}
    >
      <ConsultationBoardView />
    </AuthGuard>
  );
}
