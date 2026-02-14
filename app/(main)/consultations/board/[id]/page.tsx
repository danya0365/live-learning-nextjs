/**
 * Consultation Board Detail Page — Instructor views request + submits offer
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ConsultationBoardDetailView } from '@/src/presentation/components/consultation-board/ConsultationBoardDetailView';
import { use } from 'react';

export default function ConsultationBoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <ConsultationBoardDetailView requestId={id} />
    </AuthGuard>
  );
}
