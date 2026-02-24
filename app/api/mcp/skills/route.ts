// Skills List MCP Endpoint
// GET /api/mcp/skills - List all skills

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { listSkills, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await listSkills(filters);
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(
      mcpResponse(null, false, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
