import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/auth.services";
import { useAuthStore } from "@/stores/auth";
import { clearAuth, setToken, setUser, setRefreshToken } from "@/utils/auth";
import type {
  LoginRequest,
  VerifyTwoFactorRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ToggleTwoFactorRequest,
  ResendOtpRequest,
} from "@/types/auth";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.data.status === 1 && response.data.data) {
        if ("access_token" in response.data.data) {
          const { user, access_token, refresh_token } = response.data.data;
          login(user, access_token);
          setToken(access_token);
          setUser(user);
          setRefreshToken(refresh_token);
        }
      }
    },
  });
};

export const useVerifyTwoFactor = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyTwoFactorRequest) =>
      authService.verifyTwoFactor(data),
    onSuccess: (response) => {
      if (response.data.status === 1 && response.data.data) {
        const { user, access_token, refresh_token } = response.data.data;
        login(user, access_token);
        setToken(access_token);
        setUser(user);
        setRefreshToken(refresh_token);
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Use onSettled instead of onSuccess/onError to ensure cleanup happens regardless
      // Clear Zustand store
      logout();

      // Clear localStorage, cookies, etc.
      clearAuth();

      // Clear all React Query cache
      queryClient.clear();

      // Navigate to login
      navigate({ to: "/login" });
    },
  });
};

export const useProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (response) => {
      if (response.data.status === 1 && response.data.data?.user) {
        updateUser(response.data.data.user);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
};

export const useChangePassword = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: () => {
      // Clear Zustand store
      logout();

      // Clear localStorage, cookies, etc.
      clearAuth();

      // Clear all React Query cache
      queryClient.clear();

      // Navigate to login
      navigate({ to: "/login" });
    },
  });
};

export const useToggleTwoFactor = () => {
  const { updateUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (data: ToggleTwoFactorRequest) =>
      authService.toggleTwoFactor(data),
    onSuccess: (response) => {
      if (response.data.status === 1 && user) {
        updateUser({
          two_factor_enabled: response.data.data.two_factor_enabled,
        });
      }
    },
  });
};
