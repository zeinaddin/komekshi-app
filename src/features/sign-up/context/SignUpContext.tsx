import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { signUpReducer, initialState } from './signUpReducer';
import { SignUpState, SignUpAction, SignUpStep, Job, STEP_NUMBERS } from '../types';

interface SignUpContextValue {
  state: SignUpState;
  dispatch: React.Dispatch<SignUpAction>;

  // Convenience methods
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setOtpCode: (code: string) => void;
  setName: (name: string) => void;
  setCountry: (country: string) => void;
  setCity: (city: string) => void;
  toggleSkill: (skill: string) => void;
  setTargetJob: (job: Job | null) => void;
  setError: (field: keyof SignUpState['errors'], message: string) => void;
  clearError: (field: keyof SignUpState['errors']) => void;
  goToStep: (step: SignUpStep) => void;
  goNext: () => void;
  goBack: () => void;
  startAnalyzing: () => void;
  completeAnalyzing: () => void;
  reset: () => void;

  // Computed values
  stepNumber: number;
  totalSteps: number;
  canGoBack: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const SignUpContext = createContext<SignUpContextValue | undefined>(undefined);

interface SignUpProviderProps {
  children: ReactNode;
}

export function SignUpProvider({ children }: SignUpProviderProps) {
  const [state, dispatch] = useReducer(signUpReducer, initialState);

  const value = useMemo<SignUpContextValue>(() => {
    const stepNumber = STEP_NUMBERS[state.currentStep];
    const totalSteps = 7; // Excluding 'initial' step from count

    return {
      state,
      dispatch,

      // Convenience methods
      setEmail: (email: string) => dispatch({ type: 'SET_EMAIL', payload: email }),
      setPassword: (password: string) => dispatch({ type: 'SET_PASSWORD', payload: password }),
      setConfirmPassword: (password: string) =>
        dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: password }),
      setOtpCode: (code: string) => dispatch({ type: 'SET_OTP_CODE', payload: code }),
      setName: (name: string) => dispatch({ type: 'SET_NAME', payload: name }),
      setCountry: (country: string) => dispatch({ type: 'SET_COUNTRY', payload: country }),
      setCity: (city: string) => dispatch({ type: 'SET_CITY', payload: city }),
      toggleSkill: (skill: string) => dispatch({ type: 'TOGGLE_SKILL', payload: skill }),
      setTargetJob: (job: Job | null) => dispatch({ type: 'SET_TARGET_JOB', payload: job }),
      setError: (field: keyof SignUpState['errors'], message: string) =>
        dispatch({ type: 'SET_ERROR', payload: { field, message } }),
      clearError: (field: keyof SignUpState['errors']) =>
        dispatch({ type: 'CLEAR_ERROR', payload: field }),
      goToStep: (step: SignUpStep) => dispatch({ type: 'GO_TO_STEP', payload: step }),
      goNext: () => dispatch({ type: 'GO_NEXT' }),
      goBack: () => dispatch({ type: 'GO_BACK' }),
      startAnalyzing: () => dispatch({ type: 'START_ANALYZING' }),
      completeAnalyzing: () => dispatch({ type: 'COMPLETE_ANALYZING' }),
      reset: () => dispatch({ type: 'RESET' }),

      // Computed values
      stepNumber,
      totalSteps,
      canGoBack: state.currentStep !== 'initial',
      isFirstStep: state.currentStep === 'initial',
      isLastStep: state.currentStep === 'analyzing',
    };
  }, [state]);

  return <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>;
}

export function useSignUp(): SignUpContextValue {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
}
