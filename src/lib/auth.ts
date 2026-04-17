import { supabase } from '@/lib/supabaseClient';
import type { AuthInput } from '@/schemas/auth';

export async function signUp({ email, password }: AuthInput) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn({ email, password }: AuthInput) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSessionJwt(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
