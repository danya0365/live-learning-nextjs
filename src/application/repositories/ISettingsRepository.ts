import { AuthUser } from '@/src/stores/authStore';

export interface UpdateProfileData {
  userId: string;
  name: string;
  bio: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  userId: string;
  current: string;
  new: string;
}

export interface UserPreferences {
  userId: string;
  language: string;
  autoPlay: boolean;
  showOnline: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    courseReminder: boolean;
    promotions: boolean;
  };
}

export interface ISettingsRepository {
  getPreferences(userId: string): Promise<UserPreferences>;
  updateProfile(data: UpdateProfileData): Promise<AuthUser>;
  updatePassword(data: UpdatePasswordData): Promise<boolean>;
  updatePreferences(data: UserPreferences): Promise<UserPreferences>;
}
