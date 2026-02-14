import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigrations() {
  console.log('🔄 Running migrations...\n');

  const migrations = [
    '001_initial_schema.sql',
    '002_testimonials.sql'
  ];

  for (const migration of migrations) {
    try {
      console.log(`📝 Applying ${migration}...`);
      const sql = readFileSync(join('supabase', 'migrations', migration), 'utf-8');
      
      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.error(`   ❌ Error: ${error.message}`);
        }
      }
      
      console.log(`   ✅ ${migration} applied successfully\n`);
    } catch (error) {
      console.error(`   ❌ Failed to apply ${migration}:`, error.message);
    }
  }

  console.log('✅ All migrations completed!');
}

runMigrations().catch(console.error);
