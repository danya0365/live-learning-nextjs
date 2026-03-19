/**
 * Consultations Page — Student's consultation requests (Auth-protected)
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { UnauthorizedAccessView } from '@/src/presentation/components/auth/UnauthorizedAccessView';
import { ConsultationsView } from '@/src/presentation/components/consultations/ConsultationsView';

import ConsultationsSkeleton from '@/src/presentation/components/consultations/ConsultationsSkeleton';

export default function ConsultationsPage() {
  return (
    <AuthGuard 
      fallback={<ConsultationsSkeleton />}
      allowedRoles={['student']}
      unauthorizedFallback={<UnauthorizedAccessView message="หน้านี้สงวนสิทธิ์เฉพาะโปรไฟล์ประเภทนักเรียน (Student) เท่านั้น" />}
    >
      <ConsultationsView />
    </AuthGuard>
  );
}
