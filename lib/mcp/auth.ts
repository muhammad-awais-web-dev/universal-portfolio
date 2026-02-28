// MCP Authentication Helpers
import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { validateMcpApiKey } from '@/lib/data/portfolio-repository';

/**
 * Validates API key from request headers.
 * Returns { valid, canWrite } — checks DB keys first, then env var fallback (read-only).
 */
export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; canWrite: boolean }> {
  const apiKey = request.headers.get('x-mcp-api-key');

  if (!apiKey) return { valid: false, canWrite: false };

  // Try database validation first
  try {
    const result = await validateMcpApiKey(apiKey);
    if (result.valid) return result;
  } catch (error) {
    console.error('Error validating API key against database:', error);
    // Fall through to env var fallback
  }

  // Fallback to environment variable (read-only — no write permission)
  const envKey = process.env.MCP_API_KEY;
  if (!envKey) return { valid: false, canWrite: false };

  try {
    const expectedBuffer = Buffer.from(envKey, 'utf-8');
    const providedBuffer = Buffer.from(apiKey, 'utf-8');

    if (expectedBuffer.length !== providedBuffer.length) return { valid: false, canWrite: false };

    const valid = timingSafeEqual(expectedBuffer, providedBuffer);
    return { valid, canWrite: false }; // env-var keys are read-only
  } catch (error) {
    console.error('Error validating API key:', error);
    return { valid: false, canWrite: false };
  }
}

/** Creates a standardized 401 Unauthorized response */
export function unauthorizedResponse() {
  return Response.json(
    { success: false, error: 'Unauthorized: Invalid or missing API key', timestamp: new Date().toISOString() },
    { status: 401 }
  );
}

/** Creates a standardized 403 Forbidden response */
export function forbiddenResponse() {
  return Response.json(
    { success: false, error: 'Forbidden: This API key does not have write permission. Enable write access for this key in admin settings.', timestamp: new Date().toISOString() },
    { status: 403 }
  );
}

/**
 * Middleware wrapper for read-only routes (any valid API key).
 */
export function withAuth<T = unknown>(
  handler: (request: NextRequest, context: T) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    const { valid } = await validateApiKey(request);
    if (!valid) return unauthorizedResponse();
    return handler(request, context);
  };
}

/**
 * Middleware wrapper for write routes.
 * Requires a valid API key WITH can_write = true.
 * Returns 401 if key is invalid/missing, 403 if key exists but lacks write permission.
 */
export function withWriteAuth<T = unknown>(
  handler: (request: NextRequest, context: T) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    const { valid, canWrite } = await validateApiKey(request);
    if (!valid) return unauthorizedResponse();
    if (!canWrite) return forbiddenResponse();
    return handler(request, context);
  };
}
