import { NextRequest, NextResponse } from 'next/server';
import { getCachedPortfolio } from '@/lib/cache/portfolio-cache';
import { withPortfolioGuard } from '@/lib/auth/portfolio-guard';

/**
 * GET /api/portfolio
 * Returns the full portfolio payload in a single request.
 * Uses server-side caching with 3-day TTL.
 * 
 * Access Rules:
 * - Same-origin requests: Public (no authentication required)
 * - External requests: Requires API key via x-mcp-api-key header
 */
async function handleGET(_request: NextRequest) {
  try {
    const portfolio = await getCachedPortfolio();
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load portfolio', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export const GET = withPortfolioGuard(handleGET);
