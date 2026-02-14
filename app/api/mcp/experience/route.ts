// Experience List MCP Endpoint
// GET /api/mcp/experience - List work experience history

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { listExperience, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await listExperience(params);
    return Response.json(mcpResponse(result));
  } catch (error: any) {
    return Response.json(
      mcpResponse(null, false, error.message),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
