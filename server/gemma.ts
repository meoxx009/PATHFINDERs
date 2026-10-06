import dotenv from 'dotenv';
dotenv.config();

export interface GemmaCallOptions {
  systemPrompt: string;
  userPrompt: string;
}

export async function callGemmaJson<T>(
  options: GemmaCallOptions,
  schemaValidator: (data: unknown) => { success: true; data: T } | { success: false; error: any },
  fallbackGenerator: () => T
): Promise<{ data: T; isFallback: boolean; error?: string }> {
  const isDemoMode = process.env.DEMO_MODE === 'true';
  const apiUrl = process.env.GEMMA_API_URL;
  const apiKey = process.env.GEMMA_API_KEY;
  const model = process.env.GEMMA_MODEL || 'gemma-2-9b-it';

  // If DEMO_MODE or no API URL configured, return validated fallback
  if (isDemoMode || !apiUrl) {
    return {
      data: fallbackGenerator(),
      isFallback: true,
    };
  }

  // Attempt up to 2 calls (1 initial + 1 retry as required by Architecture Section 7)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `${options.systemPrompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested schema. Do not output markdown code blocks or explanations outside JSON.`,
            },
            {
              role: 'user',
              content: options.userPrompt,
            },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemma endpoint responded with HTTP ${response.status}`);
      }

      const jsonRes = await response.json();
      const rawContent = jsonRes?.choices?.[0]?.message?.content || '{}';

      // Clean up markdown block wraps if present
      const cleaned = rawContent.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleaned);

      const validation = schemaValidator(parsed);
      if (validation.success) {
        return {
          data: validation.data,
          isFallback: false,
        };
      } else {
        console.warn(`[Gemma Validation Warning] Attempt ${attempt} failed schema:`, validation.error);
      }
    } catch (err: any) {
      console.warn(`[Gemma Call Attempt ${attempt} Failed]:`, err.message);
    }
  }

  // Fallback if all attempts failed (Architecture §8)
  return {
    data: fallbackGenerator(),
    isFallback: true,
    error: 'Gemma model unavailable or schema mismatch. Switched to deterministic fallback fixture.',
  };
}
