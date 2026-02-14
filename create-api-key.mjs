import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔑 Creating MCP API Key...\n');

try {
  // Generate random 32-byte key (64 hex characters)
  const plainKey = crypto.randomBytes(32).toString('hex');
  
  // Hash the key for storage (bcrypt with 10 salt rounds)
  const keyHash = await bcrypt.hash(plainKey, 10);

  const { data, error } = await supabase
    .from('mcp_api_keys')
    .insert({
      name: 'Initial Key - ' + new Date().toISOString(),
      key_hash: keyHash,
      enabled: true,
    })
    .select('id, name, enabled, created_at')
    .single();

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  console.log('✅ API Key created successfully!\n');
  console.log('📋 Key ID:', data.id);
  console.log('📝 Name:', data.name);
  console.log('🔑 API Key (SAVE THIS - shown only once):');
  console.log('\n   ', plainKey);
  console.log('\n💡 Test with:');
  console.log('   curl http://localhost:3000/api/mcp/profile \\');
  console.log(`     -H "x-mcp-api-key: ${plainKey}"`);
  console.log('\n');
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

