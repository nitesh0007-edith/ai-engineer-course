import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

/**
 * The publishable key is intentionally safe to ship to a browser. Data safety
 * comes from the database's Row Level Security policies, never from hiding a
 * browser key. Service-role keys must never enter this repository or client.
 */
export const authConfigured = Boolean(url && publishableKey);

export const supabase: SupabaseClient | null = authConfigured
  ? createClient(url!, publishableKey!, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function coursePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
