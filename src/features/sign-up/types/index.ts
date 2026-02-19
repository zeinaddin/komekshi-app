export type SignUpStep =
  | 'initial'
  | 'email'
  | 'password'
  | 'otp'
  | 'name'
  | 'marketRegion'
  | 'targetJob'
  | 'analyzing';

export interface Job {
  id: string;
  title: string;
  subtitle: string;
  salary: string;
}

export interface SignUpState {
  currentStep: SignUpStep;
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
  name: string;
  country: string;
  city: string;
  selectedSkills: string[];
  targetJob: Job | null;
  isAnalyzing: boolean;
  analysisComplete: boolean;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
    name?: string;
  };
}

export type SignUpAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_OTP_CODE'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_COUNTRY'; payload: string }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'TOGGLE_SKILL'; payload: string }
  | { type: 'SET_TARGET_JOB'; payload: Job | null }
  | { type: 'SET_ERROR'; payload: { field: keyof SignUpState['errors']; message: string } }
  | { type: 'CLEAR_ERROR'; payload: keyof SignUpState['errors'] }
  | { type: 'GO_TO_STEP'; payload: SignUpStep }
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }
  | { type: 'START_ANALYZING' }
  | { type: 'COMPLETE_ANALYZING' }
  | { type: 'RESET' };

export const STEP_ORDER: SignUpStep[] = [
  'initial',
  'email',
  'password',
  'otp',
  'name',
  'marketRegion',
  'targetJob',
  'analyzing',
];

export const STEP_NUMBERS: Record<SignUpStep, number> = {
  initial: 0,
  email: 1,
  password: 2,
  otp: 3,
  name: 4,
  marketRegion: 5,
  targetJob: 6,
  analyzing: 7,
};
