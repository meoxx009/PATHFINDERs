import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Request } from 'express';
import { envConfig } from './env.js';

export const isServerSupabaseConfigured = envConfig.isSupabaseConfigured;

// Server-only Admin Client (used strictly for admin jobs, never for user CRUD)
export const serverAdminSupabase: SupabaseClient | null = 
  envConfig.supabaseUrl && envConfig.supabaseServiceRoleKey
    ? createClient(envConfig.supabaseUrl, envConfig.supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

// Base anon client
export const serverAnonSupabase: SupabaseClient | null =
  isServerSupabaseConfigured
    ? createClient(envConfig.supabaseUrl, envConfig.supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;

/**
 * Creates or returns a request-scoped Supabase client.
 * If the user supplied an Authorization: Bearer <token> header,
 * the client forwards this token to enforce Row-Level Security (RLS).
 */
export function getScopedSupabaseClient(req: Request): SupabaseClient | null {
  if (!isServerSupabaseConfigured) return null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return createClient(envConfig.supabaseUrl, envConfig.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: { persistSession: false },
    });
  }

  return serverAnonSupabase;
}

/**
 * Extracts and validates the authenticated user from the request header.
 */
export async function getAuthUser(req: Request) {
  if (!isServerSupabaseConfigured) return null;
  const client = getScopedSupabaseClient(req);
  if (!client) return null;

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
