/**
 * ApiProfileRepository
 * Implements IProfileRepository using API calls instead of direct Supabase connection
 * 
 * ✅ For use in CLIENT-SIDE components only
 * ✅ No connection pool issues - calls go through Next.js API routes
 */

import { AuthProfile } from "@/src/application/repositories/IAuthRepository";
import { IProfileRepository } from "@/src/application/repositories/IProfileRepository";

export class ApiProfileRepository implements IProfileRepository {
  private baseUrl = '/api/profiles';

  async getProfiles(): Promise<AuthProfile[]> {
    const res = await fetch(this.baseUrl);
    
    if (!res.ok) {
      console.error('Failed to fetch profiles');
      return [];
    }
    
    return res.json();
  }

  async switchProfile(profileId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
    });
    
    if (!res.ok) {
      console.error('Failed to switch profile');
      return false;
    }
    
    const data = await res.json();
    return data.success;
  }

  async getProfile(): Promise<AuthProfile | null> {
    const res = await fetch(`${this.baseUrl}/me`);
    
    if (!res.ok) {
       // If 404/Null, just return null
       return null;
    }
    
    return res.json();
  }
}
