import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Priority 1: .env.local (contains developer secrets)
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// Priority 2: .env (fallback)
const envDefaultPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envDefaultPath)) {
  dotenv.config({ path: envDefaultPath });
}

export interface ServerEnvConfig {
  port: number;
  aiProvider: 'google_gemini' | 'openai_compatible' | 'demo';
  aiModel: string;
  googleApiKey: string;
  aiBaseUrl: string;
  aiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  demoMode: boolean;
  isAiConfigured: boolean;
  isSupabaseConfigured: boolean;
}

export function loadEnvConfig(): ServerEnvConfig {
  const port = parseInt(process.env.PORT || '3001', 10);
  
  // AI Provider config
  const rawProvider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  const aiProvider: 'google_gemini' | 'openai_compatible' | 'demo' = 
    rawProvider === 'google_gemini'
      ? 'google_gemini'
      : rawProvider === 'openai_compatible'
        ? 'openai_compatible'
        : 'demo';

  const aiModel = process.env.AI_MODEL || '';
  const googleApiKey = process.env.GOOGLE_API_KEY || '';
  const aiBaseUrl = process.env.AI_BASE_URL || '';
  const aiApiKey = process.env.AI_API_KEY || '';

  // Supabase config
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://YOUR_PROJECT_REF.supabase.co' &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('YOUR_PROJECT_REF') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE_ANON')
  );

  let isAiConfigured = false;
  if (aiProvider === 'google_gemini') {
    isAiConfigured = Boolean(
      googleApiKey &&
      googleApiKey !== 'YOUR_GOOGLE_AI_STUDIO_API_KEY' &&
      googleApiKey !== 'REPLACE_WITH_GOOGLE_AI_STUDIO_KEY' &&
      aiModel &&
      aiModel !== 'REPLACE_WITH_EXACT_GEMINI_MODEL_ID' &&
      aiModel !== 'YOUR_EXACT_GEMINI_MODEL_ID'
    );
  } else if (aiProvider === 'openai_compatible') {
    isAiConfigured = Boolean(aiBaseUrl && aiModel);
  } else {
    isAiConfigured = true; // demo provider is always configured
  }

  // Demo mode: explicit DEMO_MODE flag, or forced if provider is not configured
  const demoMode = process.env.DEMO_MODE === 'true' || !isAiConfigured || aiProvider === 'demo';

  return {
    port,
    aiProvider,
    aiModel,
    googleApiKey,
    aiBaseUrl,
    aiApiKey,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    demoMode,
    isAiConfigured,
    isSupabaseConfigured,
  };
}

export const envConfig = loadEnvConfig();

// Safe server startup logging (NEVER leak secrets)
export function logServerConfig(): void {
  console.log('--------------------------------------------');
  console.log('[Config] SHIFT Server Environment Check:');
  console.log(`[Config] Port: ${envConfig.port}`);
  console.log(`[Config] Supabase: ${envConfig.isSupabaseConfigured ? 'configured' : 'not configured (demo fallback)'}`);
  console.log(`[Config] AI provider: ${envConfig.aiProvider}`);
  console.log(
    `[Config] AI model: ${
      envConfig.aiModel && !envConfig.aiModel.includes('REPLACE') && !envConfig.aiModel.includes('YOUR_')
        ? `configured (${envConfig.aiModel})`
        : 'not set / placeholder'
    }`
  );
  console.log(`[Config] Demo mode: ${envConfig.demoMode}`);

  if (envConfig.aiProvider === 'google_gemini') {
    if (!envConfig.googleApiKey || envConfig.googleApiKey.includes('YOUR_') || envConfig.googleApiKey.includes('REPLACE')) {
      console.warn('[Config Warning] GOOGLE_API_KEY is not set or using placeholder. Running in deterministic demo mode.');
    }
    if (!envConfig.aiModel || envConfig.aiModel.includes('YOUR_') || envConfig.aiModel.includes('REPLACE')) {
      console.warn('[Config Warning] AI_MODEL is not set. Please provide the exact model ID from Google AI Studio.');
    }
  }

  if (!envConfig.isSupabaseConfigured) {
    console.info('[Config Info] Supabase credentials not set. Running with local session storage fallback.');
  }
  console.log('--------------------------------------------');
}
