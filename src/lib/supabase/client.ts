import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const g = globalThis as unknown as { process?: { env?: Record<string, string> } };
const env = g.process?.env || {};
const meta = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};

const supabaseUrl = meta?.VITE_SUPABASE_URL || env?.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = meta?.VITE_SUPABASE_ANON_KEY || env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseUrl !== 'https://YOUR_PROJECT_REF.supabase.co' &&
  !supabaseUrl.includes('YOUR_PROJECT_REF') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('YOUR_SUPABASE_ANON')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getCurrentUser() {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    console.warn('[Supabase] Error fetching user session:', e);
    return null;
  }
}
