// Portfolio API Guard Middleware
// Protects portfolio routes from external access unless authenticated

import { NextRequest } from 'next/server';
import { validateMcpApiKey } from '@/lib/data/portfolio-repository';

/**
 * Check if request is from same origin (local)
 */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // If no origin/referer, allow (could be direct API call or same-origin)
  if (!origin && !referer) {
    return true;
  }
  
  // Check if origin matches host
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid origin URL
    }
  }
  
  // Check if referer matches host
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid referer URL
    }
  }
  
  return false;
}

/**
 * Validate API key from request headers
 */
async function hasValidApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('x-mcp-api-key');
  
  if (!apiKey) {
    return false;
  }
  
  // Check environment variable fallback
  const envKey = process.env.MCP_API_KEY;
  if (envKey && apiKey === envKey) {
    return true;
  }
  
  // Check database keys
  try {
    const { valid } = await validateMcpApiKey(apiKey);
    return valid;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

/**
 * Portfolio API Guard - allows same-origin OR valid API key
 * @returns true if request should be allowed, false otherwise
 */
export async function validatePortfolioAccess(request: NextRequest): Promise<boolean> {
  // Allow if from same origin (your own site)
  if (isSameOrigin(request)) {
    return true;
  }
  
  // For external requests, require valid API key
  return await hasValidApiKey(request);
}

/**
 * Create unauthorized response
 */
export function portfolioUnauthorizedResponse() {
  return Response.json(
    {
      error: 'Unauthorized',
      message: 'External access requires API key. Include x-mcp-api-key header.',
    },
    { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'API-Key',
      }
    }
  );
}

/**
 * Middleware wrapper for portfolio routes
 */
export function withPortfolioGuard<T = unknown>(
  handler: (request: NextRequest, context: T) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    const isAllowed = await validatePortfolioAccess(request);
    if (!isAllowed) {
      return portfolioUnauthorizedResponse();
    }
    return handler(request, context);
  };
}
