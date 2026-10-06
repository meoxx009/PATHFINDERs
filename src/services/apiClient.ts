import type {
  AnalyzeResumeResponse,
  GeneratePathResponse,
  InterviewQuestionResponse,
  InterviewEvaluateResponse,
} from '../lib/schemas';
import { supabase } from '../lib/supabase/client';

export interface HealthResponse {
  status: string;
  mode: 'live' | 'demo';
  aiProvider: string;
  aiConfigured: boolean;
  supabaseConfigured: boolean;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Ignore if session retrieval fails
    }
  }

  return headers;
}

export async function fetchHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAnalyzeResume(
  resumeText: string,
  targetRole: string,
  experienceLevel: string
): Promise<(AnalyzeResumeResponse & { resumeId?: string; analysisId?: string }) | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/analyze-resume', {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, targetRole, experienceLevel }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[ApiClient] Backend API not reachable or failed, using local deterministic engine:', e);
    return null;
  }
}

export async function fetchGeneratePath(
  targetRole: string,
  hoursPerWeek: number,
  goalDays: number,
  analysis?: any
): Promise<(GeneratePathResponse & { pathId?: string }) | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/generate-path', {
      method: 'POST',
      headers,
      body: JSON.stringify({ targetRole, hoursPerWeek, goalDays, analysis }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[ApiClient] Backend API not reachable, using local deterministic engine:', e);
    return null;
  }
}

export async function fetchInterviewQuestion(
  targetRole: string,
  questionNumber = 1
): Promise<InterviewQuestionResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/interview/question', {
      method: 'POST',
      headers,
      body: JSON.stringify({ targetRole, questionNumber }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[ApiClient] Backend API not reachable, using local deterministic engine:', e);
    return null;
  }
}

export async function fetchInterviewEvaluate(
  question: string,
  answer: string,
  targetRole: string,
  testsSkills: string[],
  sessionId?: string,
  questionId?: string
): Promise<InterviewEvaluateResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/interview/evaluate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question,
        answer,
        targetRole,
        testsSkills,
        sessionId,
        questionId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[ApiClient] Backend API not reachable, using local deterministic engine:', e);
    return null;
  }
}

export async function patchTaskStatus(taskId: string, completed: boolean): Promise<boolean> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ completed }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
