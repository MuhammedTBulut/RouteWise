import apiClient from './apiClient';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  VerifyEmailRequest,
  SendVerificationRequest,
  SocialAuthRequest,
} from '../types/auth';
import { ApiResponse } from '../types/api';
import { saveAuthData, clearAuthData } from '../utils/storage';

export const authService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  // Login with username and password
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      await saveAuthData(accessToken, refreshToken, user);
    }
    
    return response.data;
  },

  // Send verification email
  sendVerificationEmail: async (data: SendVerificationRequest): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/auth/send-verification', data);
    return response.data;
  },

  // Verify email with code
  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/auth/verify-email', data);
    return response.data;
  },

  // Social authentication (Google/Facebook)
  socialAuth: async (data: SocialAuthRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/social', data);
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      await saveAuthData(accessToken, refreshToken, user);
    }
    
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuthData();
    }
  },
};
