import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate';
import { PORTFOLIO_CACHE_TAG } from '@/lib/cache/portfolio-cache';
import { getSessionCookie } from '@/lib/auth/cookies';
import { verifySession } from '@/lib/auth/session';

/**
 * POST /api/cache/clear
 * Clears the portfolio cache
 * 
 * Access: Admin only
 */
export async function POST(_request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getSessionCookie();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No session token' },
        { status: 401 }
      );
    }

    const isValid = await verifySession(token);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }

    // Clear portfolio cache by revalidating key paths and the cache tag
    revalidateTag(PORTFOLIO_CACHE_TAG);
    revalidatePath('/api/portfolio');
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/certifications');
    revalidatePath('/education');
    revalidatePath('/experience');

    return NextResponse.json({ 
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache', details: (error as Error).message },
      { status: 500 }
    );
  }
}
