// Testimonials List MCP Endpoint
// GET /api/mcp/testimonials - List active testimonials

import { NextRequest } from 'next/server';
import { withAuth, withWriteAuth } from '@/lib/mcp/auth';
import { listTestimonials, createTestimonial, mcpResponse } from '@/lib/mcp/service';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await listTestimonials(params);
    return Response.json(mcpResponse(result));
  } catch (error: unknown) {
    return Response.json(
      mcpResponse(null, false, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createTestimonial(body);
    return Response.json(mcpResponse(result), { status: 201 });
  } catch (error: unknown) {
    return Response.json(mcpResponse(null, false, error instanceof Error ? error.message : String(error)), { status: 422 });
  }
}

export const POST = withWriteAuth(handlePOST);
