import type { AIProvider } from './provider';
import { DemoAIProvider } from './demo-provider';
import { GemmaOpenAIProvider } from './gemma-provider';
import { GeminiProvider } from './gemini-provider';

/**
 * Server-side AI Provider Factory.
 * Securely reads credentials from process.env (never exposed via VITE_* bundles).
 * Automatically defaults to DemoAIProvider if credentials or models are missing.
 */
export function getAIProvider(): AIProvider {
  const g = globalThis as unknown as { process?: { env?: Record<string, string> } };
  const env = g.process?.env || {};

  const providerType = (env.AI_PROVIDER || 'demo').toLowerCase();
  const demoMode = env.DEMO_MODE === 'true';

  // Explicit demo mode request
  if (demoMode || providerType === 'demo') {
    return new DemoAIProvider();
  }

  // 1. Google Gemini Provider
  if (providerType === 'google_gemini') {
    const googleKey = env.GOOGLE_API_KEY || '';
    const model = env.AI_MODEL || '';

    const isValidKey = Boolean(
      googleKey &&
      !googleKey.includes('YOUR_') &&
      !googleKey.includes('REPLACE_')
    );

    const isValidModel = Boolean(
      model &&
      !model.includes('YOUR_') &&
      !model.includes('REPLACE_')
    );

    if (isValidKey && isValidModel) {
      return new GeminiProvider(googleKey, model);
    }

    console.warn('[AI Factory] Google Gemini credentials incomplete. Falling back to DemoAIProvider.');
    return new DemoAIProvider();
  }

  // 2. Gemma OpenAI-Compatible Provider
  if (providerType === 'openai_compatible') {
    const baseUrl = env.AI_BASE_URL || '';
    const apiKey = env.AI_API_KEY || '';
    const model = env.AI_MODEL || '';

    if (baseUrl && model) {
      return new GemmaOpenAIProvider(baseUrl, apiKey, model);
    }

    console.warn('[AI Factory] OpenAI-compatible credentials incomplete. Falling back to DemoAIProvider.');
    return new DemoAIProvider();
  }

  // Fallback to DemoAIProvider
  return new DemoAIProvider();
}
