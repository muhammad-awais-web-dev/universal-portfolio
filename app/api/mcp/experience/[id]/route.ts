// Single Experience MCP Endpoint
// GET /api/mcp/experience/[id] - Get specific work experience entry by ID

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getExperience, mcpResponse } from '@/lib/mcp/service';

async function handleGET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return Response.json(
        mcpResponse(null, false, 'Invalid experience ID'),
        { status: 400 }
      );
    }
    
    const experience = await getExperience(id);
    return Response.json(mcpResponse(experience));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes('not found') ? 404 : 500;
    return Response.json(
      mcpResponse(null, false, message),
      { status }
    );
  }
}

export const GET = withAuth(handleGET);
