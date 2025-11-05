export const AUTH_ENDPOINTS = {
  // Public Auth Routes
  LOGIN: "/login",
  VERIFY_TWO_FACTOR: "/verify-two-factor",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  REFRESH_TOKEN: "/refresh-token",
  RESEND_OTP: "/resend-otp",

  // Protected Auth Routes
  LOGOUT: "/logout",
  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  TOGGLE_TWO_FACTOR: "/toggle-two-factor",
} as const;
