import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  walletAddress: string | null;
  hasWallet: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        set({ 
          user: {
            ...user,
            hasWallet: !!user.walletAddress
          }, 
          token, 
          isAuthenticated: true 
        });
      },
      
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...updates,
              hasWallet: !!(updates.walletAddress ?? currentUser.walletAddress)
            } 
          });
        }
      },
    }),
    {
      name: "subra-auth",
    }
  )
);
