import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@subra/sdk";
import { setAccessToken, clearAccessToken, getAccessToken } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        setAccessToken(token);
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        clearAccessToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = getAccessToken();
        if (token) {
          setAccessToken(token);
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: "subra-auth",
    }
  )
);

