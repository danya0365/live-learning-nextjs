/**
 * Consultations Page — Student's consultation requests (Auth-protected)
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationsView } from '@/src/presentation/components/consultations/ConsultationsView';

import ConsultationsSkeleton from '@/src/presentation/components/consultations/ConsultationsSkeleton';

export default function ConsultationsPage() {
  return (
    <AuthGuard fallback={<ConsultationsSkeleton />}>
      <ConsultationsView />
    </AuthGuard>
  );
}
