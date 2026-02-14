// Single Skill MCP Endpoint
// GET /api/mcp/skills/[id] - Get specific skill by ID or name

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { getSkill, mcpResponse } from '@/lib/mcp/service';

async function handleGET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Check if id is numeric or name
    const idOrName = /^\d+$/.test(id) ? parseInt(id) : decodeURIComponent(id);
    
    const skill = await getSkill(idOrName);
    return Response.json(mcpResponse(skill));
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 500;
    return Response.json(
      mcpResponse(null, false, error.message),
      { status }
    );
  }
}

export const GET = withAuth(handleGET);
