/**
 * IProfileRepository
 * Interface for Profile Repository
 * Following Clean Architecture - Application layer
 */

import { AuthProfile } from "./IAuthRepository";

export interface Achievement {
  icon: string;
  label: string;
  description: string;
  unlockedAt?: string | null;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  joinDate: string;
  level: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface IProfileRepository {
  /**
   * Get all profiles associated with the current user
   */
  getProfiles(): Promise<AuthProfile[]>;

  /**
   * Switch the active profile
   * @param profileId ID of the profile to switch to
   */
  switchProfile(profileId: string): Promise<boolean>;

  /**
   * Get the current active profile
   */
  getProfile(): Promise<AuthProfile | null>;

  /**
   * Get profile by specific ID
   */
  getById(id: string): Promise<AuthProfile | null>;

}
