export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface SendVerificationRequest {
  email: string;
}

export interface SocialAuthRequest {
  provider: 'google' | 'facebook';
  accessToken: string;
}

export interface PasswordValidation {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
