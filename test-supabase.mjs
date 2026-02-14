import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  try {
    // Use admin auth endpoint to verify service_role key works
    const { data, error } = await supabase.auth.admin.listUsers({ limit: 1 });
    if (error) {
      console.error('Supabase admin error:', error);
      process.exit(1);
    }
    console.log('Supabase connection OK — sample response:', Array.isArray(data) ? data.length + ' users' : data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
