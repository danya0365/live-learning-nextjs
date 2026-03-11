/**
 * IAuthRepository
 * Interface for Authentication Repository
 * Following Clean Architecture - Application layer
 */

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthProfile {
  id: string;
  authId: string;
  username?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  role: 'student' | 'instructor' | 'admin';
  preferences?: {
    language: string;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: Record<string, string>;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: AuthProfile | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  error?: string;
  message?: string;
  needsEmailVerification?: boolean;
  needsPhoneVerification?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OTPSignInData {
  phone: string;
  channel?: 'sms' | 'whatsapp';
}

export interface VerifyOTPData {
  phone: string;
  token: string;
}

export interface UpdateProfileData {
  username?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'auto';
  };
  socialLinks?: Record<string, string>;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  newPassword: string;
}

export interface IAuthRepository {
  signUp(data: SignUpData): Promise<AuthResult>;
  signIn(data: SignInData): Promise<AuthResult>;
  signInWithOTP(data: OTPSignInData): Promise<AuthResult>;
  verifyOTP(data: VerifyOTPData): Promise<AuthResult>;
  signInWithOAuth(provider: 'google' | 'facebook' | 'github' | 'line'): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
  getSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  getProfile(): Promise<AuthProfile | null>;
  getProfiles(): Promise<AuthProfile[]>;
  switchProfile(profileId: string): Promise<boolean>;
  updateProfile(data: UpdateProfileData): Promise<AuthProfile>;
  resetPassword(data: ResetPasswordData): Promise<AuthResult>;
  updatePassword(data: UpdatePasswordData): Promise<AuthResult>;
  resendEmailVerification(email: string): Promise<AuthResult>;
  verifyEmail(token: string): Promise<AuthResult>;
  refreshSession(): Promise<AuthSession | null>;
  
  /**
   * Subscribe to auth state changes
   * Returns an unsubscribe function
   */
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
