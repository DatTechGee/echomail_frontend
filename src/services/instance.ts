import { getToken, clearAuth } from "@/utils/auth";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.echomail.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRedirecting = false;

// Add a request interceptor to include the auth token
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      const publicRoutes = [
        "/login",
        "/forgot-password",
        "/reset-password",
        "/verify-two-factor",
        "/join-newsletters",
      ];

      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some((route) =>
        currentPath.includes(route)
      );

      // Only handle auth cleanup and redirect if not already on a public route
      // and not already redirecting
      if (!isPublicRoute && !isRedirecting) {
        isRedirecting = true;

        // Clear all auth data (localStorage, cookies, and Zustand store)
        clearAuth();

        // Clear the Zustand store
        useAuthStore.getState().logout();

        // Small delay to ensure state is cleared before redirect
        setTimeout(() => {
          isRedirecting = false;
          window.location.href = "/login";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
