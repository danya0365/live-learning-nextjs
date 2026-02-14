/**
 * Consultation Board Detail Page — Instructor views request + submits offer
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationBoardDetailView } from '@/src/presentation/components/consultation-board/ConsultationBoardDetailView';
import { use } from 'react';

import ConsultationDetailSkeleton from '@/src/presentation/components/consultations/ConsultationDetailSkeleton';

export default function ConsultationBoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard fallback={<ConsultationDetailSkeleton />}>
      <ConsultationBoardDetailView requestId={id} />
    </AuthGuard>
  );
}
