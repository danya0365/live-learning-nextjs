/**
 * IProfileRepository
 * Interface for Profile Repository
 * Following Clean Architecture - Application layer
 */

import { AuthProfile } from "./IAuthRepository";

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
}
