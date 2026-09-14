import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);

export interface SavedLeague {
  id: string;
  session_id: string;
  sleeper_username: string;
  league_id: string;
  league_name: string;
  created_at: string;
}
