import { NextResponse } from 'next/server';
import { getFullPortfolio } from '@/lib/data/portfolio-repository';

/**
 * GET /api/portfolio
 * Returns the full portfolio payload in a single request.
 * Public endpoint — used by PortfolioContext on load and by future public site.
 */
export async function GET() {
  try {
    const portfolio = await getFullPortfolio();
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load portfolio', details: (error as Error).message },
      { status: 500 }
    );
  }
}
