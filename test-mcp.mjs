#!/usr/bin/env node
// Test MCP Server Endpoints
// Usage: node test-mcp.mjs

import { randomBytes } from 'crypto';

const BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.MCP_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: MCP_API_KEY environment variable not set');
  console.log('\nSet it with:');
  console.log('  export MCP_API_KEY=your-key-here');
  console.log('\nOr generate a new key with:');
  console.log('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

console.log('🧪 Testing MCP Server Endpoints\n');
console.log(`Base URL: ${BASE_URL}`);
console.log(`API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 8)}\n`);

async function testEndpoint(name, url, expectData = true) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'x-mcp-api-key': API_KEY,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ ${name}: ${response.status}`);
      if (expectData && !data.data) {
        console.log(`   ⚠️  Warning: No data returned (might be empty database)`);
      }
      return true;
    } else {
      console.log(`❌ ${name}: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Network error`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function runTests() {
  const tests = [
    ['Manifest', '/api/mcp/manifest'],
    ['Profile', '/api/mcp/profile'],
    ['List Projects', '/api/mcp/projects'],
    ['List Projects (paginated)', '/api/mcp/projects?page=1&limit=5'],
    ['List Skills', '/api/mcp/skills'],
    ['List Certifications', '/api/mcp/certifications'],
    ['List Education', '/api/mcp/education'],
    ['List Experience', '/api/mcp/experience'],
    ['List Testimonials', '/api/mcp/testimonials'],
    ['List Featured Testimonials', '/api/mcp/testimonials?featured=true'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, url] of tests) {
    const result = await testEndpoint(name, url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  // Test authentication failure
  console.log('\n🔒 Testing authentication...');
  const badResponse = await fetch(`${BASE_URL}/api/mcp/profile`, {
    headers: {
      'x-mcp-api-key': 'invalid-key',
    },
  });
  
  if (badResponse.status === 401) {
    console.log('✅ Authentication: Correctly rejects invalid key');
  } else {
    console.log('❌ Authentication: Should return 401 for invalid key');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
