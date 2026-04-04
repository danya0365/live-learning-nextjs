'use client';

import { ProfileViewModel } from '@/src/presentation/presenters/profile/ProfilePresenter';
import { useProfilePresenter } from '@/src/presentation/presenters/profile/useProfilePresenter';
import { useAuthStore, type AuthUser } from '@/src/stores/authStore';
import { AdminProfileSection } from './AdminProfileSection';
import { InstructorProfileSection } from './InstructorProfileSection';
import { ProfileHeader } from './ProfileHeader';
import ProfileSkeleton from './ProfileSkeleton';
import { StudentProfileSection } from './StudentProfileSection';

interface ProfileViewProps {
  initialViewModel?: ProfileViewModel;
  /** If provided, overlays auth user info on the profile */
  authUser?: AuthUser | null;
}

export function ProfileView({ initialViewModel, authUser }: ProfileViewProps) {
  const state = useProfilePresenter(initialViewModel);
  const vm = state.viewModel;
  const { user: storeUser } = useAuthStore();
  
  if (state.loading && !vm) {
    return <ProfileSkeleton />;
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <button onClick={() => state.loadData()} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  // 1. Single Source of Truth handling for User Info
  // If we have an authUser, we overlay it to the viewModel profile 
  const profile = authUser
    ? { ...vm.profile, name: authUser.name, email: authUser.email, avatar: authUser.avatar, level: authUser.level, joinDate: authUser.joinDate }
    : vm.profile;

  // Pass down the merged profile to the vm locally so sections get updated data if they ever need it
  const mergedVm = { ...vm, profile };

  const isAdmin = profile.role === 'admin';
  const isInstructor = profile.role === 'instructor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ProfileHeader profile={profile} />

      {isAdmin ? (
        <AdminProfileSection />
      ) : isInstructor ? (
        <InstructorProfileSection vm={mergedVm} />
      ) : (
        <StudentProfileSection vm={mergedVm} />
      )}
    </div>
  );
}
