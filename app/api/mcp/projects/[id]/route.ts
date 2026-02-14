// Single Project MCP Endpoint
// GET /api/mcp/projects/[id] - Get specific project by ID or slug

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getProject, mcpResponse } from '@/lib/mcp/service';

async function handleGET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Check if id is numeric or slug
    const idOrSlug = /^\d+$/.test(id) ? parseInt(id) : id;
    
    const project = await getProject(idOrSlug);
    return Response.json(mcpResponse(project));
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 500;
    return Response.json(
      mcpResponse(null, false, error.message),
      { status }
    );
  }
}

export const GET = withAuth(handleGET);
