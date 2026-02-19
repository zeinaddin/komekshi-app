import { SignUpState, SignUpAction, STEP_ORDER, SignUpStep } from '../types';

export const initialState: SignUpState = {
  currentStep: 'initial',
  email: '',
  password: '',
  confirmPassword: '',
  otpCode: '',
  name: '',
  country: '',
  city: '',
  selectedSkills: [],
  targetJob: null,
  isAnalyzing: false,
  analysisComplete: false,
  errors: {},
};

function getNextStep(currentStep: SignUpStep): SignUpStep {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex < STEP_ORDER.length - 1) {
    return STEP_ORDER[currentIndex + 1];
  }
  return currentStep;
}

function getPreviousStep(currentStep: SignUpStep): SignUpStep {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex > 0) {
    return STEP_ORDER[currentIndex - 1];
  }
  return currentStep;
}

export function signUpReducer(state: SignUpState, action: SignUpAction): SignUpState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, errors: { ...state.errors, email: undefined } };

    case 'SET_PASSWORD':
      return { ...state, password: action.payload, errors: { ...state.errors, password: undefined } };

    case 'SET_CONFIRM_PASSWORD':
      return {
        ...state,
        confirmPassword: action.payload,
        errors: { ...state.errors, confirmPassword: undefined },
      };

    case 'SET_OTP_CODE':
      return { ...state, otpCode: action.payload, errors: { ...state.errors, otp: undefined } };

    case 'SET_NAME':
      return { ...state, name: action.payload, errors: { ...state.errors, name: undefined } };

    case 'SET_COUNTRY':
      return { ...state, country: action.payload };

    case 'SET_CITY':
      return { ...state, city: action.payload };

    case 'TOGGLE_SKILL': {
      const skill = action.payload;
      const isSelected = state.selectedSkills.includes(skill);
      return {
        ...state,
        selectedSkills: isSelected
          ? state.selectedSkills.filter((s) => s !== skill)
          : [...state.selectedSkills, skill],
      };
    }

    case 'SET_TARGET_JOB':
      return { ...state, targetJob: action.payload };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: undefined },
      };

    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };

    case 'GO_NEXT':
      return { ...state, currentStep: getNextStep(state.currentStep) };

    case 'GO_BACK':
      return { ...state, currentStep: getPreviousStep(state.currentStep) };

    case 'START_ANALYZING':
      return { ...state, isAnalyzing: true, analysisComplete: false };

    case 'COMPLETE_ANALYZING':
      return { ...state, isAnalyzing: false, analysisComplete: true };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
