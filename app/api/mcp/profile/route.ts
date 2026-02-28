// Profile MCP Endpoint
// GET /api/mcp/profile - Get portfolio owner's profile
// PUT /api/mcp/profile - Update profile (requires write permission)

import { NextRequest } from 'next/server';
import { withAuth, withWriteAuth } from '@/lib/mcp/auth';
import { getProfile, updateProfile, mcpResponse } from '@/lib/mcp/service';

async function handleGET(_request: NextRequest) {
  try {
    const result = await getProfile();
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(
      mcpResponse(null, false, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

async function handlePUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateProfile(body);
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(mcpResponse(null, false, message), { status: 500 });
  }
}

export const GET = withAuth(handleGET);
export const PUT = withWriteAuth(handlePUT);
