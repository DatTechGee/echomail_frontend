/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AUTH_ENDPOINTS } from "../endpoints/auth";
import type {
  LoginRequest,
  VerifyTwoFactorRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ToggleTwoFactorRequest,
  ResendOtpRequest,
  ApiResponse,
  AuthResponse,
  TwoFactorResponse,
  ProfileResponse,
  User,
} from "@/types/auth";
import instance from "../instance";

export const authService = {
  // Public Auth Methods
  login: (data: LoginRequest) => {
    return instance.post<ApiResponse<AuthResponse | TwoFactorResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
  },

  verifyTwoFactor: (data: VerifyTwoFactorRequest) => {
    return instance.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.VERIFY_TWO_FACTOR,
      data
    );
  },

  forgotPassword: (data: ForgotPasswordRequest) => {
    return instance.post<ApiResponse<{ email: string }>>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
  },

  resetPassword: (data: ResetPasswordRequest) => {
    return instance.post<ApiResponse<{}>>(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  },

  refreshToken: (data: RefreshTokenRequest) => {
    return instance.post<
      ApiResponse<{ access_token: string; refresh_token: string }>
    >(AUTH_ENDPOINTS.REFRESH_TOKEN, data);
  },

  resendOtp: (data: ResendOtpRequest) => {
    return instance.post<ApiResponse<{}>>(AUTH_ENDPOINTS.RESEND_OTP, data);
  },

  // Protected Auth Methods
  logout: () => {
    return instance.post<ApiResponse<{}>>(AUTH_ENDPOINTS.LOGOUT);
  },

  getProfile: () => {
    return instance.get<ApiResponse<ProfileResponse>>(AUTH_ENDPOINTS.PROFILE);
  },

  updateProfile: (data: UpdateProfileRequest) => {
    return instance.put<ApiResponse<{ user: User }>>(
      AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );
  },

  changePassword: (data: ChangePasswordRequest) => {
    return instance.post<ApiResponse<{}>>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  toggleTwoFactor: (data: ToggleTwoFactorRequest) => {
    return instance.post<ApiResponse<{ two_factor_enabled: boolean }>>(
      AUTH_ENDPOINTS.TOGGLE_TWO_FACTOR,
      data
    );
  },
};
