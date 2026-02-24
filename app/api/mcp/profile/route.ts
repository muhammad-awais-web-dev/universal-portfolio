// Profile MCP Endpoint
// GET /api/mcp/profile - Get portfolio owner's profile

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getProfile, mcpResponse } from '@/lib/mcp/service';

async function handleGET(_request: NextRequest) {
  try {
    const profile = await getProfile();
    return Response.json(mcpResponse(profile));
  } catch (error: unknown) {
    return Response.json(
      mcpResponse(null, false, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
