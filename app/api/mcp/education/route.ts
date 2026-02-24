// Education List MCP Endpoint
// GET /api/mcp/education - List education history

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { listEducation, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await listEducation(params);
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(
      mcpResponse(null, false, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
