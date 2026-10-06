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

export class GemmaOpenAIProvider implements AIProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private fallback: DemoAIProvider;

  constructor(baseUrl: string, apiKey: string, model: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.model = model;
    this.fallback = new DemoAIProvider();
  }

  private async callModelWithRetry<T>(
    systemPrompt: string,
    userPrompt: string,
    validator: (data: unknown) => { success: true; data: T } | { success: false; error: any },
    fallbackFn: () => Promise<T>
  ): Promise<T> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: `${systemPrompt}\n\nCRITICAL: Respond ONLY with valid JSON. Do not include markdown wraps or conversational commentary outside the JSON object.`,
              },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const json = await res.json();
        const content = json?.choices?.[0]?.message?.content || '{}';
        const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleaned);

        const validation = validator(parsed);
        if (validation.success) {
          return validation.data;
        } else {
          console.warn(`[GemmaProvider] Attempt ${attempt} failed schema:`, validation.error);
        }
      } catch (err: any) {
        console.warn(`[GemmaProvider] Attempt ${attempt} failed:`, err.message);
      }
    }

    console.warn('[GemmaProvider] All attempts failed, using deterministic fallback.');
    return fallbackFn();
  }

  async analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysis> {
    const userPrompt = `Target Role: ${input.targetRole}\nExperience Level: ${input.experienceLevel}\n\nResume Text:\n${input.resumeText}`;
    return this.callModelWithRetry(
      RESUME_ANALYSIS_PROMPT,
      userPrompt,
      (d) => ResumeAnalysisSchema.safeParse(d) as any,
      () => this.fallback.analyzeResume(input)
    );
  }

  async generateLearningPath(input: LearningPathInput): Promise<LearningPath> {
    const userPrompt = `Target Role: ${input.targetRole}\nWeekly Hours: ${input.hoursPerWeek}\nSprint Duration: ${input.durationDays} days\nAnalysis Context: ${JSON.stringify(input.analysis?.skillGaps || [])}`;
    return this.callModelWithRetry(
      LEARNING_PATH_PROMPT,
      userPrompt,
      (d) => LearningPathSchema.safeParse(d) as any,
      () => this.fallback.generateLearningPath(input)
    );
  }

  async generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestion> {
    const userPrompt = `Target Role: ${input.targetRole}\nResume Context: ${JSON.stringify(input.resumeAnalysis?.strengths || [])}`;
    return this.callModelWithRetry(
      INTERVIEW_QUESTION_PROMPT,
      userPrompt,
      (d) => InterviewQuestionSchema.safeParse(d) as any,
      () => this.fallback.generateInterviewQuestion(input)
    );
  }

  async evaluateInterviewAnswer(input: InterviewEvaluationInput): Promise<InterviewEvaluation> {
    const userPrompt = `Target Role: ${input.targetRole}\nQuestion: ${input.question}\nTested Skills: ${input.testedSkills.join(', ')}\nAnswer: ${input.answer}`;
    return this.callModelWithRetry(
      INTERVIEW_EVALUATION_PROMPT,
      userPrompt,
      (d) => InterviewEvaluationSchema.safeParse(d) as any,
      () => this.fallback.evaluateInterviewAnswer(input)
    );
  }
}
