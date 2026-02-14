/**
 * New Consultation Request Page — Student creates a new request
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { NewConsultationView } from '@/src/presentation/components/consultations/NewConsultationView';

import NewConsultationSkeleton from '@/src/presentation/components/consultations/NewConsultationSkeleton';

export default function NewConsultationPage() {
  return (
    <AuthGuard fallback={<NewConsultationSkeleton />}>
      <NewConsultationView />
    </AuthGuard>
  );
}
