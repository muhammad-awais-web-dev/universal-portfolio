// Projects List MCP Endpoint
// GET /api/mcp/projects - List all published projects

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { listProjects, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      skill: searchParams.get('skill') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await listProjects(filters);
    return Response.json(mcpResponse(result));
  } catch (error: any) {
    return Response.json(
      mcpResponse(null, false, error.message),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
