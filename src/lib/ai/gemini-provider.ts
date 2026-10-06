import type {
  AIProvider,
  ResumeAnalysisInput,
  LearningPathInput,
  InterviewQuestionInput,
  InterviewEvaluationInput,
} from './provider';
import {
  ResumeAnalysisSchema,
  LearningPathSchema,
  InterviewQuestionSchema,
  InterviewEvaluationSchema,
  type ResumeAnalysis,
  type LearningPath,
  type InterviewQuestion,
  type InterviewEvaluation,
} from './schemas';
import {
  RESUME_ANALYSIS_PROMPT,
  LEARNING_PATH_PROMPT,
  INTERVIEW_QUESTION_PROMPT,
  INTERVIEW_EVALUATION_PROMPT,
} from './prompts';
import { DemoAIProvider } from './demo-provider';

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;
  private fallback: DemoAIProvider;

  constructor(apiKey: string, model = 'gemini-2.5-flash') {
    this.apiKey = apiKey;
    // Strip leading 'models/' prefix if present
    this.model = model.replace(/^models\//, '');
    this.fallback = new DemoAIProvider();
  }

  private cleanJsonString(raw: string): string {
    let cleaned = raw.trim();
    // Remove markdown code fences like ```json ... ``` or ``` ... ```
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
      cleaned = cleaned.replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  private async callGeminiWithRetry<T>(
    systemInstruction: string,
    userPrompt: string,
    validator: (data: unknown) => { success: true; data: T } | { success: false; error: any },
    fallbackFn: () => Promise<T>
  ): Promise<T> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${systemInstruction}\n\n${userPrompt}\n\nIMPORTANT: Return ONLY a valid JSON object strictly matching the expected schema. Do not include markdown commentary or preamble outside the JSON object.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API HTTP ${response.status}: ${errText.substring(0, 150)}`);
        }

        const json = await response.json();
        const rawContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawContent) {
          throw new Error('Gemini returned an empty candidate text part');
        }

        const cleaned = this.cleanJsonString(rawContent);
        const parsed = JSON.parse(cleaned);

        const validation = validator(parsed);
        if (validation.success) {
          return validation.data;
        } else {
          console.warn(`[GeminiProvider] Attempt ${attempt} failed schema validation:`, validation.error?.message || validation.error);
        }
      } catch (err: any) {
        console.warn(`[GeminiProvider] Attempt ${attempt} encountered error:`, err?.message || err);
      }
    }

    console.warn('[GeminiProvider] Retries exhausted. Gracefully engaging deterministic fallback.');
    return fallbackFn();
  }

  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysis> {
    const userPrompt = `Target Role: ${input.targetRole}\nExperience Level: ${input.experienceLevel}\n\nResume Text:\n${input.resumeText}`;
    return this.callGeminiWithRetry(
      RESUME_ANALYSIS_PROMPT,
      userPrompt,
      (d) => ResumeAnalysisSchema.safeParse(d) as any,
      () => this.fallback.analyzeResume(input)
    );
  }

  async generateLearningPath(input: LearningPathInput): Promise<LearningPath> {
    const userPrompt = `Target Role: ${input.targetRole}\nWeekly Hours: ${input.hoursPerWeek}\nSprint Duration: ${input.durationDays} days\nSkill Gaps: ${JSON.stringify(input.analysis?.skillGaps || [])}`;
    return this.callGeminiWithRetry(
      LEARNING_PATH_PROMPT,
      userPrompt,
      (d) => LearningPathSchema.safeParse(d) as any,
      () => this.fallback.generateLearningPath(input)
    );
  }

  async generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestion> {
    const userPrompt = `Target Role: ${input.targetRole}\nProjects Context: ${JSON.stringify(input.resumeAnalysis?.strengths || [])}`;
    return this.callGeminiWithRetry(
      INTERVIEW_QUESTION_PROMPT,
      userPrompt,
      (d) => InterviewQuestionSchema.safeParse(d) as any,
      () => this.fallback.generateInterviewQuestion(input)
    );
  }

  async evaluateInterviewAnswer(input: InterviewEvaluationInput): Promise<InterviewEvaluation> {
    const userPrompt = `Target Role: ${input.targetRole}\nQuestion: ${input.question}\nTested Skills: ${(input.testedSkills || []).join(', ')}\nAnswer: ${input.answer}`;
    return this.callGeminiWithRetry(
      INTERVIEW_EVALUATION_PROMPT,
      userPrompt,
      (d) => InterviewEvaluationSchema.safeParse(d) as any,
      () => this.fallback.evaluateInterviewAnswer(input)
    );
  }
}
