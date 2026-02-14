// Testimonials List MCP Endpoint
// GET /api/mcp/testimonials - List active testimonials

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { listTestimonials, mcpResponse } from '@/lib/mcp/service';

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
  } catch (error: any) {
    return Response.json(
      mcpResponse(null, false, error.message),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
