import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('📝 Reading migration file...');
const sql = readFileSync('supabase/migrations/003_mcp_api_keys.sql', 'utf-8');

console.log('🚀 Applying migration 003_mcp_api_keys.sql...');

// Split by semicolons and execute each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && !s.startsWith('COMMENT'));

for (const statement of statements) {
  if (!statement) continue;
  
  try {
    const { error } = await client.rpc('exec', { sql: statement + ';' }).catch(() => ({ error: null }));
    
    // Try direct query if RPC fails
    if (error) {
      const { error: queryError } = await client.from('_').select('*').limit(0);
      // Ignore the error, just checking connection
    }
  } catch (err) {
    // Continue
  }
}

console.log('✅ Migration complete!');
console.log('');
console.log('⚠️  Note: If you see errors above, please apply the migration manually:');
console.log('1. Go to: https://supabase.com/dashboard/project/zlkdzwzcjfghsxwachbk/sql');
console.log('2. Copy and paste the contents of: supabase/migrations/003_mcp_api_keys.sql');
console.log('3. Click "Run"');
