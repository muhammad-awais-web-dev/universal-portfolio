// MCP Authentication Helpers
import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Validates API key from request headers
 * Uses constant-time comparison to prevent timing attacks
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mcp-api-key');
  const expectedKey = process.env.MCP_API_KEY;

  // Check if MCP is enabled
  if (process.env.MCP_ENABLED !== 'true') {
    return false;
  }

  // Check if API key is configured
  if (!expectedKey) {
    console.error('MCP_API_KEY not configured in environment variables');
    return false;
  }

  // Check if API key was provided
  if (!apiKey) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(expectedKey, 'utf-8');
    const providedBuffer = Buffer.from(apiKey, 'utf-8');

    // Only compare if lengths match (timingSafeEqual requires same length)
    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

/**
 * Creates a standardized 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return Response.json(
    {
      success: false,
      error: 'Unauthorized: Invalid or missing API key',
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Middleware wrapper for API routes requiring authentication
 * Supports both simple routes and dynamic routes with params
 */
export function withAuth<T = any>(
  handler: (request: NextRequest, context: T) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    if (!validateApiKey(request)) {
      return unauthorizedResponse();
    }
    return handler(request, context);
  };
}
