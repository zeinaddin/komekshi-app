import { create } from 'zustand';
import { modulesService, questionsService } from '../api/services';
import { UserSkillDTO, QuestionDTO, UserQuestionDTO, ProgressStatisticsDTO } from '../api/types';
import { getErrorMessage } from '../api/client';

interface ModulesState {
  modules: UserSkillDTO[];
  currentModule: UserSkillDTO | null;
  questions: QuestionDTO[];
  userAnswers: UserQuestionDTO[];
  statistics: ProgressStatisticsDTO | null;
  isLoading: boolean;
  isLoadingQuestions: boolean;
  error: string | null;
}

interface ModulesActions {
  fetchModules: () => Promise<void>;
  setCurrentModule: (module: UserSkillDTO | null) => void;
  fetchModuleQuestions: (skillId: number) => Promise<void>;
  fetchUserAnswers: (moduleId?: number) => Promise<void>;
  fetchModuleStatistics: (moduleId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type ModulesStore = ModulesState & ModulesActions;

const initialState: ModulesState = {
  modules: [],
  currentModule: null,
  questions: [],
  userAnswers: [],
  statistics: null,
  isLoading: false,
  isLoadingQuestions: false,
  error: null,
};

export const useModulesStore = create<ModulesStore>((set) => ({
  ...initialState,

  fetchModules: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await modulesService.getMyModules({
        populate_skill: true,
        per_page: 50,
      });
      set({ modules: response.items, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  setCurrentModule: (module: UserSkillDTO | null) => {
    set({ currentModule: module });
  },

  fetchModuleQuestions: async (skillId: number) => {
    try {
      set({ isLoadingQuestions: true, error: null });
      const response = await questionsService.getQuestionsBySkill(skillId, {
        populate_skill: true,
        per_page: 50,
      });
      set({ questions: response.items, isLoadingQuestions: false });
    } catch (error) {
      set({
        isLoadingQuestions: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchUserAnswers: async (moduleId?: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await questionsService.getMyAnswers({
        module_id: moduleId,
        populate_question: true,
        per_page: 50,
      });
      set({ userAnswers: response.items, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchModuleStatistics: async (moduleId: number) => {
    try {
      set({ isLoading: true, error: null });
      const statistics = await modulesService.getModuleStatistics(moduleId);
      set({ statistics, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
