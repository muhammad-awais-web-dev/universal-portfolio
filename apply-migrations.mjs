import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  console.log('Applying migrations...');
  
  // Read the initial schema
  const schema1 = readFileSync('supabase/migrations/001_initial_schema.sql', 'utf-8');
  const schema2 = readFileSync('supabase/migrations/002_testimonials.sql', 'utf-8');
  
  const projectId = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || 'your-project-id';
  
  console.log('Migration files loaded. Please apply them manually via Supabase SQL Editor:');
  console.log(`1. Go to: https://supabase.com/dashboard/project/${projectId}/sql`);
  console.log('2. Copy and paste the contents of:');
  console.log('   - supabase/migrations/001_initial_schema.sql');
  console.log('   - supabase/migrations/002_testimonials.sql');
  console.log('3. Run each migration');
  
  // Try to check if tables exist
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  if (error) {
    console.log('\n⚠️  Tables not found - migrations need to be applied');
  } else {
    console.log('\n✅ Database tables exist!');
  }
}

apply();
