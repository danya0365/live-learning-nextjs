/**
 * Profile Page — Auth-protected
 * Uses AuthGuard + passes auth user to ProfileView
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { ProfileView } from '@/src/presentation/components/profile/ProfileView';
import { useProfilePresenter } from '@/src/presentation/presenters/profile/useProfilePresenter';
import { useAuthStore } from '@/src/stores/authStore';

import ProfileSkeleton from '@/src/presentation/components/profile/ProfileSkeleton';

export default function ProfilePage() {
  return (
    <AuthGuard fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user } = useAuthStore();
  const state = useProfilePresenter();

  return (
    <ProfileView
      initialViewModel={state.viewModel ?? undefined}
      authUser={user}
    />
  );
}
