// Single Education MCP Endpoint
// GET /api/mcp/education/[id] - Get specific education entry by ID

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getEducation, mcpResponse } from '@/lib/mcp/service';

async function handleGET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return Response.json(
        mcpResponse(null, false, 'Invalid education ID'),
        { status: 400 }
      );
    }
    
    const education = await getEducation(id);
    return Response.json(mcpResponse(education));
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
