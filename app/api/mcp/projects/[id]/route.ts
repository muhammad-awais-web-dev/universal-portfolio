// Single Project MCP Endpoint
// GET /api/mcp/projects/[id] - Get project by ID or slug
// PUT /api/mcp/projects/[id] - Update project (requires write permission)
// DELETE /api/mcp/projects/[id] - Delete project (requires write permission)

import { NextRequest } from 'next/server';
import { withAuth, withWriteAuth } from '@/lib/mcp/auth';
import { getProject, updateProject, deleteProject, mcpResponse } from '@/lib/mcp/service';

type Context = { params: Promise<{ id: string }> };

async function handleGET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const idOrSlug = /^\d+$/.test(id) ? parseInt(id) : id;
    const project = await getProject(idOrSlug);
    return Response.json(mcpResponse(project));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(mcpResponse(null, false, message), { status: message.includes('not found') ? 404 : 500 });
  }
}

async function handlePUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateProject({ ...body, id: Number(id) });
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(mcpResponse(null, false, message), { status: 422 });
  }
}

async function handleDELETE(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const result = await deleteProject(Number(id));
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(mcpResponse(null, false, error instanceof Error ? error.message : String(error)), { status: 500 });
  }
}

export const GET = withAuth(handleGET);
export const PUT = withWriteAuth(handlePUT);
export const DELETE = withWriteAuth(handleDELETE);
