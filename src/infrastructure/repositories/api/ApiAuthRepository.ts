import { ActiveSession, AuthResult, AuthSession, IAuthRepository, SignUpData, SignInData, OTPSignInData, VerifyOTPData, UpdateProfileData, ResetPasswordData, UpdatePasswordData, AuthProfile, AuthUser } from '@/src/application/repositories/IAuthRepository';

export class ApiAuthRepository implements IAuthRepository {
  private baseUrl = '/api/auth';

  async getActiveSessions(): Promise<ActiveSession[]> {
    const res = await fetch(`${this.baseUrl}/sessions`);
    if (!res.ok) throw new Error('Failed to fetch active sessions');
    return res.json();
  }

  async revokeOtherSessions(): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/sessions`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to revoke other sessions');
    const data = await res.json();
    return data.success;
  }

  // Mandatory interface methods, but not used in settings
  async signUp(data: SignUpData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async signIn(data: SignInData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async signInWithOTP(data: OTPSignInData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async verifyOTP(data: VerifyOTPData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async signInWithOAuth(provider: any): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async signOut(): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async getSession(): Promise<AuthSession | null> { throw new Error('Not implemented on API repo'); }
  async getCurrentUser(): Promise<AuthUser | null> { throw new Error('Not implemented on API repo'); }
  async getProfile(): Promise<AuthProfile | null> { throw new Error('Not implemented on API repo'); }
  async getProfiles(): Promise<AuthProfile[]> { throw new Error('Not implemented on API repo'); }
  async switchProfile(profileId: string): Promise<boolean> { throw new Error('Not implemented on API repo'); }
  async updateProfile(data: UpdateProfileData): Promise<AuthProfile> { throw new Error('Not implemented on API repo'); }
  async resetPassword(data: ResetPasswordData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async updatePassword(data: UpdatePasswordData): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async resendEmailVerification(email: string): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async verifyEmail(token: string): Promise<AuthResult> { throw new Error('Not implemented on API repo'); }
  async refreshSession(): Promise<AuthSession | null> { throw new Error('Not implemented on API repo'); }
  onAuthStateChange(callback: any): () => void { throw new Error('Not implemented on API repo'); }
}
