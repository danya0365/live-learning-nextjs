/**
 * New Consultation Request Page — Student creates a new request
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { NewConsultationView } from '@/src/presentation/components/consultations/NewConsultationView';

export default function NewConsultationPage() {
  return (
    <AuthGuard>
      <NewConsultationView />
    </AuthGuard>
  );
}
