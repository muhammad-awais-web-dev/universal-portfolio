// Projects List MCP Endpoint
// GET /api/mcp/projects - List published projects
// POST /api/mcp/projects - Create a project (requires write permission)

import { NextRequest } from 'next/server';
import { withAuth, withWriteAuth } from '@/lib/mcp/auth';
import { listProjects, createProject, mcpResponse } from '@/lib/mcp/service';

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
  } catch (error: unknown) {
    return Response.json(mcpResponse(null, false, error instanceof Error ? error.message : String(error)), { status: 500 });
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createProject(body);
    return Response.json(mcpResponse(result), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(mcpResponse(null, false, message), { status: 422 });
  }
}

export const GET = withAuth(handleGET);
export const POST = withWriteAuth(handlePOST);
