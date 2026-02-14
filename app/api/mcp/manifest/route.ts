// MCP Manifest Endpoint
// Returns information about all available MCP tools

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/mcp/auth';
import { mcpResponse } from '@/lib/mcp/service';
import { MCP_TOOLS } from '@/lib/mcp/schemas';
import { MCPManifest } from '@/lib/mcp/types';

async function handleGET(request: NextRequest) {
  try {
    const baseUrl = request.nextUrl.origin;
    
    const manifest: MCPManifest = {
      name: 'Universal Portfolio MCP Server',
      version: '1.0.0',
      description: 'Read-only access to portfolio data including projects, skills, certifications, education, experience, and testimonials',
      tools: MCP_TOOLS,
      instructions: {
        usage: {
          description: 'This MCP server provides a unified POST endpoint for calling any tool',
          endpoint: `${baseUrl}/api/mcp`,
          method: 'POST',
          contentType: 'application/json',
          authentication: {
            type: 'header',
            header: 'x-mcp-api-key',
            description: 'Include your API key in the x-mcp-api-key header'
          }
        },
        requestFormat: {
          description: 'Send a JSON body with tool name and parameters',
          schema: {
            tool: 'string (required) - Name of the tool to call from the tools list',
            parameters: 'object (optional) - Tool-specific parameters as defined in the tool schema'
          },
          example: {
            tool: 'list_projects',
            parameters: {
              category: 'Web',
              limit: 5
            }
          }
        },
        responseFormat: {
          description: 'All responses follow a standardized format',
          schema: {
            success: 'boolean - Whether the request succeeded',
            data: 'any - The response data (null on error)',
            error: 'string | null - Error message if success is false',
            timestamp: 'string - ISO 8601 timestamp of the response'
          },
          successExample: {
            success: true,
            data: { id: 1, title: 'My Project', /* ... */ },
            error: null,
            timestamp: '2026-02-14T05:00:00.000Z'
          },
          errorExample: {
            success: false,
            data: null,
            error: 'Project not found',
            timestamp: '2026-02-14T05:00:00.000Z'
          }
        },
        bestPractices: [
          'Always check the success field before processing data',
          'Use pagination parameters (page, limit) for list operations to avoid large responses',
          'Cache profile and skill/category lists as they change infrequently',
          'Use project/skill IDs or slugs for get operations',
          'Handle 404 errors gracefully when requesting specific items',
          'Respect rate limits (if applicable)',
        ],
        errorHandling: {
          '400': 'Bad Request - Invalid tool name or missing required parameters',
          '401': 'Unauthorized - Invalid or missing API key',
          '404': 'Not Found - Requested resource does not exist',
          '500': 'Internal Server Error - Something went wrong on the server'
        }
      }
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
