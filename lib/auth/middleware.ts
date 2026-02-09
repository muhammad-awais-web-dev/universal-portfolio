/**
 * Authentication Middleware
 * Protects /protected/* routes and Cloudinary API endpoints
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie, hasSessionCookie } from './cookies';
import { verifySession } from './session';

/**
 * Check if a route should be protected
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/protected');
}

/**
 * Check if an API route should be protected (Cloudinary endpoints only)
 */
function isProtectedApiRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/api/cloudinary') ||
    pathname === '/api/upload'
  );
}

/**
 * Check if the user can access the route (has valid session)
 */
async function canAccessRoute(): Promise<boolean> {
  try {
    const token = await getSessionCookie();
    if (!token) return false;
    
    return await verifySession(token);
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

/**
 * Main middleware function - handles auth checks for protected routes
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow login page access without authentication
  if (pathname === '/protected/login') {
    return NextResponse.next();
  }
  
  // Check protected page routes
  if (isProtectedRoute(pathname)) {
    const hasAccess = await canAccessRoute();
    
    if (!hasAccess) {
      // Redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = '/protected/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Check protected API routes
  if (isProtectedApiRoute(pathname)) {
    const hasAccess = await canAccessRoute();
    
    if (!hasAccess) {
      // Return 401 Unauthorized for API routes
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  // Allow access to all other routes (public homepage, future public APIs, etc.)
  return NextResponse.next();
}
