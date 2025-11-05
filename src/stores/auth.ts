import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastAttemptedRoute: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setLastAttemptedRoute: (route: string) => void;
  canAccessRoute: (pathname: string) => boolean;
  getRedirectPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      lastAttemptedRoute: null,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          lastAttemptedRoute: null,
        });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
            isAuthenticated: true,
          });
        }
      },

      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setLastAttemptedRoute: (route) => set({ lastAttemptedRoute: route }),

      canAccessRoute: (pathname: string) => {
        const { isAuthenticated } = get();

        // Define protected routes
        const protectedRoutes = ["/dashboard", "/campaigns", "/newsletters"];
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (isProtectedRoute) {
          return isAuthenticated;
        }

        return true;
      },

      getRedirectPath: () => {
        const { lastAttemptedRoute } = get();

        // If there's a last attempted route and user can access it, go there
        if (lastAttemptedRoute && get().canAccessRoute(lastAttemptedRoute)) {
          return lastAttemptedRoute;
        }

        // Otherwise, redirect to dashboard
        return "/dashboard";
      },
    }),
    {
      name: "echomail-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
