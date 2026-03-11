import { create } from 'zustand';
import { authService, userService } from '../api/services';
import { getTokens, clearTokens } from '../api/tokenStorage';
import { UserDTO } from '../api/types';
import { getErrorMessage } from '../api/client';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: UserDTO | null;
  error: string | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, code: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDTO | null) => void;
  clearError: () => void;
  completeOnboarding: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const tokens = await getTokens();

      if (tokens) {
        const user = await userService.getProfile({
          populate_city: true,
          populate_direction: true,
          populate_skills: true,
        });
        set({
          isAuthenticated: true,
          user,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch {
      await clearTokens();
      set({
        isAuthenticated: false,
        user: null,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await authService.login({ email, password });
      const user = await userService.getProfile({
        populate_city: true,
        populate_direction: true,
        populate_skills: true,
      });
      set({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  register: async (email: string, password: string, code: string) => {
    try {
      set({ isLoading: true, error: null });
      await authService.verifyOtpAndRegister({ email, password, code });
      const user = await userService.getProfile();
      set({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  sendOtp: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await authService.sendOtp(email);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },

  setUser: (user: UserDTO | null) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },

  completeOnboarding: () => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          is_onboarding_completed: true,
        },
      });
    }
  },
}));
