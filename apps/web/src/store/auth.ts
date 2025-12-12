import { create } from "zustand";
import { User } from "@subra/sdk";
import { setAccessToken, clearAccessToken } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
}));

