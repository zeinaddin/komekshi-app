import { create } from 'zustand';
import { userService, directionsService } from '../api/services';
import { UserDTO, StreakDTO, UserProfileCreateSchema, UserProfileUpdateSchema, ProgressStatisticsDTO, SalaryDTO } from '../api/types';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from './authStore';

interface UserState {
  profile: UserDTO | null;
  streak: StreakDTO | null;
  statistics: ProgressStatisticsDTO | null;
  salary: SalaryDTO | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchProfile: () => Promise<void>;
  createProfile: (data: UserProfileCreateSchema) => Promise<UserDTO>;
  updateProfile: (data: UserProfileUpdateSchema) => Promise<void>;
  fetchStreak: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchSalary: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
  profile: null,
  streak: null,
  statistics: null,
  salary: null,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const profile = await userService.getProfile({
        populate_city: true,
        populate_direction: true,
        populate_skills: true,
      });
      set({ profile, isLoading: false });
      useAuthStore.getState().setUser(profile);
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  createProfile: async (data: UserProfileCreateSchema) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await userService.createProfile(data);
      set({ profile, isLoading: false });
      useAuthStore.getState().setUser(profile);
      return profile;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  updateProfile: async (data: UserProfileUpdateSchema) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await userService.updateProfile(data);
      set({ profile, isLoading: false });
      useAuthStore.getState().setUser(profile);
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchStreak: async () => {
    try {
      set({ isLoading: true, error: null });
      const streak = await userService.getStreak();
      set({ streak, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchStatistics: async () => {
    try {
      set({ isLoading: true, error: null });
      const statistics = await directionsService.getMyStatistics();
      set({ statistics, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchSalary: async () => {
    try {
      const salary = await directionsService.getMySalary();
      set({ salary });
    } catch {
      // Salary might not be available for all users, silently ignore
      set({ salary: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
