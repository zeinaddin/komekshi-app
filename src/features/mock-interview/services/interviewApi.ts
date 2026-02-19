export interface VoiceTurnResponse {
  transcript?: string;
  aiReplyText?: string;
  aiReplyAudioUrl?: string;
  nextQuestion?: string;
}

const FALLBACK_QUESTIONS = [
  'Great. Now describe a backend project where you improved performance under load.',
  'How would you design API rate limiting for multi-tenant clients?',
  'When do you choose SQL vs NoSQL, and what trade-offs matter most?',
  'Tell me about a production incident you handled and what you changed after it.',
];

export const DEFAULT_OPENING_QUESTION =
  'Good morning, Dimash. Tell me briefly about your backend experience and the systems you are most confident with.';

const WAIT_MS = 1200;

function sanitizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

function fallbackVoiceTurn(turn: number): VoiceTurnResponse {
  const nextQuestion = FALLBACK_QUESTIONS[turn % FALLBACK_QUESTIONS.length];
  return {
    transcript: 'Voice answer received.',
    nextQuestion,
  };
}

export async function submitVoiceTurn(params: {
  audioUri: string;
  turn: number;
}): Promise<VoiceTurnResponse> {
  const baseUrl = process.env.EXPO_PUBLIC_MOCK_INTERVIEW_API_URL?.trim();

  if (!baseUrl) {
    await delay(WAIT_MS);
    return fallbackVoiceTurn(params.turn);
  }

  const formData = new FormData();
  formData.append(
    'audio',
    {
      uri: params.audioUri,
      type: 'audio/m4a',
      name: `answer-${Date.now()}.m4a`,
    } as unknown as Blob
  );

  const response = await fetch(`${sanitizeBaseUrl(baseUrl)}/mock-interview/voice`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    throw new Error(errorMessage ?? 'Mock interview request failed');
  }

  const payload = (await response.json()) as VoiceTurnResponse & {
    aiText?: string;
    aiAudioUrl?: string;
    answer?: string;
    question?: string;
  };

  return {
    transcript: payload.transcript,
    aiReplyText: payload.aiReplyText ?? payload.aiText ?? payload.answer,
    aiReplyAudioUrl: payload.aiReplyAudioUrl ?? payload.aiAudioUrl,
    nextQuestion: payload.nextQuestion ?? payload.question,
  };
}
