import { SignUpProvider, SignUpFlowScreen } from '@/src/features/sign-up';

export default function SignUp() {
  return (
    <SignUpProvider>
      <SignUpFlowScreen />
    </SignUpProvider>
  );
}
