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

import { withWriteAuth } from '@/lib/mcp/auth';
import { updateSkill, deleteSkill } from '@/lib/mcp/service';

async function handlePUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateSkill({ ...body, id: Number(id) });
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(mcpResponse(null, false, error instanceof Error ? error.message : String(error)), { status: 422 });
  }
}

async function handleDELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const result = await deleteSkill(Number(id));
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(mcpResponse(null, false, error instanceof Error ? error.message : String(error)), { status: 500 });
  }
}

export const PUT = withWriteAuth(handlePUT);
export const DELETE = withWriteAuth(handleDELETE);
