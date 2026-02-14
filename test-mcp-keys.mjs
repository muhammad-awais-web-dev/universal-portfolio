import { config } from 'dotenv';
config({ path: '.env.local' });

const API_BASE = 'http://localhost:3000';
const MCP_API_KEY = process.env.MCP_API_KEY;
const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE;

console.log('🧪 Testing MCP API Keys Management\n');

// Test 1: Check manifest includes instructions
async function testManifest() {
  console.log('1️⃣  Testing manifest endpoint with instructions...');
  try {
    const response = await fetch(`${API_BASE}/api/mcp/manifest`, {
      headers: { 'x-mcp-api-key': MCP_API_KEY },
    });
    
    const data = await response.json();
    
    if (data.success && data.data.instructions) {
      console.log('   ✅ Manifest includes instructions');
      console.log('   📄 Instructions sections:', Object.keys(data.data.instructions).join(', '));
    } else {
      console.log('   ❌ Manifest missing instructions');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Test 2: Create new API key via admin endpoint
async function testCreateKey() {
  console.log('2️⃣  Testing API key creation...');
  try {
    const response = await fetch(`${API_BASE}/api/admin/mcp-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSPHRASE}`,
      },
      body: JSON.stringify({ name: 'Test Key ' + Date.now() }),
    });
    
    const data = await response.json();
    
    if (data.key) {
      console.log('   ✅ API key created successfully');
      console.log('   🔑 Key preview:', data.key.substring(0, 16) + '...');
      console.log('   📋 Key ID:', data.id);
      return { key: data.key, id: data.id };
    } else {
      console.log('   ❌ Failed to create key:', data.error);
      return null;
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
    return null;
  }
  console.log();
}

// Test 3: List API keys
async function testListKeys() {
  console.log('3️⃣  Testing list API keys...');
  try {
    const response = await fetch(`${API_BASE}/api/admin/mcp-keys`, {
      headers: { 'Authorization': `Bearer ${ADMIN_PASSPHRASE}` },
    });
    
    const data = await response.json();
    
    if (data.keys) {
      console.log('   ✅ Listed', data.keys.length, 'API keys');
      data.keys.forEach(key => {
        console.log(`   - ${key.name} (${key.enabled ? 'enabled' : 'disabled'})`);
      });
    } else {
      console.log('   ❌ Failed to list keys');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Test 4: Authenticate with new key
async function testAuthWithNewKey(key) {
  console.log('4️⃣  Testing authentication with new key...');
  try {
    const response = await fetch(`${API_BASE}/api/mcp/profile`, {
      headers: { 'x-mcp-api-key': key },
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Authentication successful with new key');
    } else {
      console.log('   ❌ Authentication failed:', data.error);
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Test 5: Toggle key
async function testToggleKey(keyId) {
  console.log('5️⃣  Testing toggle key (disable)...');
  try {
    const response = await fetch(`${API_BASE}/api/admin/mcp-keys`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSPHRASE}`,
      },
      body: JSON.stringify({ id: keyId, enabled: false }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Key disabled successfully');
      return true;
    } else {
      console.log('   ❌ Failed to disable key:', data.error);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
    return false;
  }
  console.log();
}

// Test 6: Auth should fail with disabled key
async function testAuthWithDisabledKey(key) {
  console.log('6️⃣  Testing authentication with disabled key...');
  try {
    const response = await fetch(`${API_BASE}/api/mcp/profile`, {
      headers: { 'x-mcp-api-key': key },
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('   ✅ Authentication correctly rejected (key disabled)');
    } else if (data.success) {
      console.log('   ❌ Authentication should have failed but succeeded');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Test 7: Delete key
async function testDeleteKey(keyId) {
  console.log('7️⃣  Testing delete key...');
  try {
    const response = await fetch(`${API_BASE}/api/admin/mcp-keys?id=${keyId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${ADMIN_PASSPHRASE}` },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Key deleted successfully');
    } else {
      console.log('   ❌ Failed to delete key:', data.error);
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Test 8: Test env variable fallback
async function testEnvFallback() {
  console.log('8️⃣  Testing environment variable fallback...');
  try {
    const response = await fetch(`${API_BASE}/api/mcp/profile`, {
      headers: { 'x-mcp-api-key': MCP_API_KEY },
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Environment variable key still works');
    } else {
      console.log('   ❌ Environment variable key failed');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  console.log();
}

// Run all tests
(async () => {
  await testManifest();
  await testListKeys();
  
  const newKey = await testCreateKey();
  
  if (newKey) {
    await testAuthWithNewKey(newKey.key);
    await testToggleKey(newKey.id);
    await testAuthWithDisabledKey(newKey.key);
    await testDeleteKey(newKey.id);
  }
  
  await testEnvFallback();
  
  console.log('✨ All tests completed!\n');
})();
