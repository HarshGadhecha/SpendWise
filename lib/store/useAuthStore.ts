import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboardingCompleted: boolean;

  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsOnboardingCompleted: (completed: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboardingCompleted: false,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsOnboardingCompleted: (completed) => set({ isOnboardingCompleted: completed }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    isOnboardingCompleted: false
  }),
}));
