/**
 * Consultation Detail Page — Student views request details + offers
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationDetailView } from '@/src/presentation/components/consultations/ConsultationDetailView';
import { use } from 'react';

import ConsultationDetailSkeleton from '@/src/presentation/components/consultations/ConsultationDetailSkeleton';

export default function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard fallback={<ConsultationDetailSkeleton />}>
      <ConsultationDetailView requestId={id} />
    </AuthGuard>
  );
}
