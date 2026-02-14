// Profile MCP Endpoint
// GET /api/mcp/profile - Get portfolio owner's profile

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getProfile, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const profile = await getProfile();
    return Response.json(mcpResponse(profile));
  } catch (error: any) {
    return Response.json(
      mcpResponse(null, false, error.message),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
