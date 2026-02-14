import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;

if (url && serviceRole) {
  supabaseAdmin = createClient(url, serviceRole, { auth: { persistSession: false } });
}

export { supabaseAdmin };
