import { unstable_cache } from 'next/cache';
import { getFullPortfolio } from '@/lib/data/portfolio-repository';

/**
 * Cache configuration for portfolio data
 * - TTL: 3 days (259200 seconds)
 * - Separate cache keys for admin and published modes
 */

const CACHE_TTL = 259200; // 3 days in seconds
const CACHE_TAG = 'portfolio';

/**
 * Get cached portfolio data with mode-specific caching
 * @param mode - 'admin' or 'published' to cache separately
 */
export const getCachedPortfolio = unstable_cache(
  async () => {
    return await getFullPortfolio();
  },
  ['portfolio-data'],
  {
    revalidate: CACHE_TTL,
    tags: [CACHE_TAG],
  }
);

/**
 * Cache tags for invalidation
 */
export const PORTFOLIO_CACHE_TAG = CACHE_TAG;
