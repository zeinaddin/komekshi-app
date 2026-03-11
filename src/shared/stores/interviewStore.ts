import { create } from 'zustand';
import { interviewService } from '../api/services';
import {
  InterviewStartResponse,
  InterviewSession,
  InterviewAnswerResponse,
  InterviewQuestion,
} from '../api/types';
import { getErrorMessage } from '../api/client';

interface InterviewState {
  session: InterviewStartResponse | null;
  activeSession: InterviewSession | null;
  currentQuestion: InterviewQuestion | null;
  lastAnswer: InterviewAnswerResponse | null;
  isLoading: boolean;
  isProcessing: boolean;
  isResumed: boolean; // True if we resumed an existing session
  error: string | null;
}

interface ResumeOrStartResult {
  isNew: boolean;
  session: InterviewStartResponse | InterviewSession;
  question?: InterviewQuestion | null;
}

interface InterviewActions {
  startInterview: () => Promise<InterviewStartResponse>;
  resumeOrStartInterview: () => Promise<ResumeOrStartResult>;
  submitAnswer: (audioUri: string) => Promise<InterviewAnswerResponse>;
  fetchActiveSession: () => Promise<InterviewSession | null>;
  setCurrentQuestion: (question: InterviewQuestion | null) => void;
  setSessionFromActive: (activeSession: InterviewSession) => void;
  clearError: () => void;
  reset: () => void;
}

type InterviewStore = InterviewState & InterviewActions;

const initialState: InterviewState = {
  session: null,
  activeSession: null,
  currentQuestion: null,
  lastAnswer: null,
  isLoading: false,
  isProcessing: false,
  isResumed: false,
  error: null,
};

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  ...initialState,

  startInterview: async () => {
    try {
      set({ isLoading: true, error: null });
      const session = await interviewService.startInterview();
      set({
        session,
        currentQuestion: session.question,
        isLoading: false,
        isResumed: false,
      });
      return session;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  resumeOrStartInterview: async () => {
    try {
      set({ isLoading: true, error: null });

      // First check for active session
      const activeSession = await interviewService.getActiveSession();

      if (activeSession && activeSession.status === 'active') {
        // Try to fetch the current question for the session
        let currentQuestion: InterviewQuestion | null = null;

        if (activeSession.current_interview_question_id) {
          currentQuestion = await interviewService.getCurrentQuestion(activeSession.session_id);
        }

        // Create session object
        const sessionData: InterviewStartResponse = {
          session_id: activeSession.session_id,
          main_question_index: activeSession.current_main_index,
          total_main_questions: activeSession.total_main_questions,
          question: currentQuestion || {
            interview_question_id: activeSession.current_interview_question_id || 0,
            text: '',
          },
          followup_limit: 3,
        };

        set({
          session: sessionData,
          activeSession,
          currentQuestion: currentQuestion || sessionData.question,
          isLoading: false,
          isResumed: !currentQuestion, // Only marked as resumed if we don't have the question
        });

        return {
          isNew: false,
          session: activeSession,
          question: currentQuestion,
        };
      }

      // No active session, start new one
      const newSession = await interviewService.startInterview();
      set({
        session: newSession,
        currentQuestion: newSession.question,
        isLoading: false,
        isResumed: false,
      });

      return { isNew: true, session: newSession, question: newSession.question };
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  submitAnswer: async (audioUri: string) => {
    const { session, currentQuestion } = get();
    if (!session) {
      throw new Error('No active interview session');
    }

    // For resumed sessions, we might not have a valid interview_question_id initially
    // The backend should handle this by using the session's current question
    const questionId = currentQuestion?.interview_question_id || 0;

    try {
      set({ isProcessing: true, error: null });
      const response = await interviewService.submitAnswer(
        session.session_id,
        questionId,
        audioUri
      );

      // Determine the next question based on response status
      let nextQuestion = null;
      if (response.status === 'need_followup' && response.followup_question) {
        nextQuestion = response.followup_question;
      } else if (response.status === 'final' && response.next_question) {
        nextQuestion = response.next_question;
      }

      // Update session progress if available
      const updatedSession = response.main_question_index !== undefined
        ? { ...session, main_question_index: response.main_question_index }
        : session;

      set({
        session: updatedSession,
        lastAnswer: response,
        currentQuestion: nextQuestion,
        isProcessing: false,
        isResumed: false, // After first answer, we're back to normal flow
      });

      return response;
    } catch (error) {
      set({
        isProcessing: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  fetchActiveSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const activeSession = await interviewService.getActiveSession();
      set({ activeSession, isLoading: false });
      return activeSession;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  setCurrentQuestion: (question: InterviewQuestion | null) => {
    set({ currentQuestion: question });
  },

  setSessionFromActive: (activeSession: InterviewSession) => {
    const sessionData: InterviewStartResponse = {
      session_id: activeSession.session_id,
      main_question_index: activeSession.current_main_index,
      total_main_questions: activeSession.total_main_questions,
      question: {
        interview_question_id: activeSession.current_interview_question_id || 0,
        text: '',
      },
      followup_limit: 3,
    };
    set({
      session: sessionData,
      activeSession,
      currentQuestion: sessionData.question,
      isResumed: true,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
