/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  profile_image?: string | null;
  bio?: string;
  status: UserStatus;
  two_factor_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface VerifyTwoFactorRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
}

export interface ToggleTwoFactorRequest {
  isEnabled: boolean;
  password: string;
}

export interface ResendOtpRequest {
  email: string;
  type: "reset" | "2fa";
}

// Response Types
export interface ApiResponse<T = any> {
  status: number; // 1 for success, 0 for error
  message: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends AuthResponse {}

export interface TwoFactorResponse {
  email: string;
  requires_2fa: boolean;
  user_id: string;
}

export interface ProfileResponse extends User {}
