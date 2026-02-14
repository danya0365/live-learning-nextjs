/**
 * Profile Page — Auth-protected
 * Uses AuthGuard + passes auth user to ProfileView
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ProfileView } from '@/src/presentation/components/profile/ProfileView';

import ProfileSkeleton from '@/src/presentation/components/profile/ProfileSkeleton';

export default function ProfilePage() {
  return (
    <AuthGuard fallback={<ProfileSkeleton />}>
      <ProfileView />
    </AuthGuard>
  );
}
