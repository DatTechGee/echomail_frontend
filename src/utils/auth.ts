import type { User } from "@/types/auth";
import Cookies from "js-cookie";

export const getToken = () => {
  try {
    const cookieToken = Cookies.get("echomail_token");
    if (cookieToken) return cookieToken;

    const localStorageToken = localStorage.getItem("echomail_token");
    if (localStorageToken) return localStorageToken;

    return null;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const setToken = (token: string) => {
  Cookies.set("echomail_token", token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  localStorage.setItem("echomail_token", token);
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem("echomail_refresh_token");
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem("echomail_refresh_token", token);
};

export const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("echomail_user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

export const setUser = (user: User) => {
  localStorage.setItem("echomail_user", JSON.stringify(user));
};

export const clearAuth = () => {
  // Clear cookies
  Cookies.remove("echomail_token");

  // Clear localStorage
  localStorage.removeItem("echomail_token");
  localStorage.removeItem("echomail_user");
  localStorage.removeItem("echomail_refresh_token");

  // Clear Zustand persisted state
  localStorage.removeItem("echomail-auth-storage");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isTwoFactorEnabled = (): boolean => {
  const user = getUser();
  return !!user?.two_factor_enabled;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getFullName = (): string => {
  const user = getUser();
  if (!user) return "";

  return (
    user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim()
  );
};

export const getInitials = (): string => {
  const user = getUser();
  if (!user) return "";

  const firstInitial = user.first_name?.charAt(0) || "";
  const lastInitial = user.last_name?.charAt(0) || "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const updateUserInStorage = (updates: Partial<User>) => {
  const currentUser = getUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...updates };
  setUser(updatedUser);
};

export const getUserStatus = (): string => {
  const user = getUser();
  return user?.status || "inactive";
};

export const isUserActive = (): boolean => {
  return getUserStatus() === "active";
};

export const getProfileImage = (): string | null => {
  const user = getUser();
  return user?.profile_image || null;
};

export const getUserEmail = (): string => {
  const user = getUser();
  return user?.email || "";
};

export const getUserPhone = (): string | null => {
  const user = getUser();
  return user?.phone || null;
};

export const getUserBio = (): string => {
  const user = getUser();
  return user?.bio || "";
};

export const getLastLoginAt = (): string | null => {
  const user = getUser();
  return user?.last_login_at || null;
};
