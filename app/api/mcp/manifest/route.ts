// MCP Manifest Endpoint
// Returns information about all available MCP tools

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { mcpResponse } from '@/lib/mcp/service';
import { MCP_TOOLS } from '@/lib/mcp/schemas';
import { MCPManifest } from '@/lib/mcp/types';

async function handleGET(request: NextRequest) {
  try {
    const manifest: MCPManifest = {
      name: 'Universal Portfolio MCP Server',
      version: '1.0.0',
      description: 'Read-only access to portfolio data including projects, skills, certifications, education, experience, and testimonials',
      tools: MCP_TOOLS,
    };

    return Response.json(mcpResponse(manifest));
  } catch (error: any) {
    return Response.json(
      mcpResponse(null, false, error.message),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
