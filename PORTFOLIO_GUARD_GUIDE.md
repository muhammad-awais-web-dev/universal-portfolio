# Portfolio API Guard - Implementation Guide

## Overview
The Portfolio API Guard allows same-origin requests (from your own site) to access portfolio routes without authentication, while requiring API keys for external requests.

## How It Works

### Access Rules:
- **Same-origin requests** (from your site): ✅ Public - No API key needed
- **External requests** (from other sites): 🔒 Requires API key via `x-mcp-api-key` header

### Detection Method:
The guard checks the `Origin` and `Referer` headers:
- If they match your site's host → Allow access
- If they don't match (external) → Require API key

## Implementation

### Already Protected Routes:
✅ `/api/portfolio` - Main portfolio endpoint  
✅ `/api/portfolio/profile` - Profile data

### To Protect Additional Routes:

1. **Import the guard**:
```typescript
import { NextRequest } from 'next/server';
import { withPortfolioGuard } from '@/lib/auth/portfolio-guard';
```

2. **Wrap GET handler**:
```typescript
// Before:
export async function GET() {
  // ... handler code
}

// After:
async function handleGET(request: NextRequest) {
  // ... handler code (add request parameter)
}

export const GET = withPortfolioGuard(handleGET);
```

3. **Keep PUT/POST/DELETE handlers unchanged** (already require admin auth)

### Example Pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withPortfolioGuard } from '@/lib/auth/portfolio-guard';

// GET - Protected by portfolio guard
async function handleGET(request: NextRequest) {
  try {
    const data = await fetchSomeData();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    );
  }
}

export const GET = withPortfolioGuard(handleGET);

// POST/PUT/DELETE - Keep existing admin auth
export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;
  // ... handler code
}
```

## Routes That Need Protection

Apply the guard to all GET endpoints in:

- [ ] `/api/portfolio/projects/route.ts`
- [ ] `/api/portfolio/projects/[projectId]/route.ts`
- [ ] `/api/portfolio/skills/route.ts`
- [ ] `/api/portfolio/skills/[skillId]/route.ts`
- [ ] `/api/portfolio/certifications/route.ts`
- [ ] `/api/portfolio/certifications/[certificationId]/route.ts`
- [ ] `/api/portfolio/education/route.ts`
- [ ] `/api/portfolio/education/[educationId]/route.ts`
- [ ] `/api/portfolio/experience/route.ts`
- [ ] `/api/portfolio/experience/[experienceId]/route.ts`
- [ ] `/api/portfolio/testimonials/route.ts`
- [ ] `/api/portfolio/testimonials/[testimonialId]/route.ts`
- [ ] `/api/portfolio/project-categories/route.ts`
- [ ] `/api/portfolio/project-categories/[categoryId]/route.ts`
- [ ] `/api/portfolio/skill-categories/route.ts`
- [ ] `/api/portfolio/skill-categories/[categoryId]/route.ts`

## Testing

### Test same-origin access (no API key):
```bash
curl http://localhost:3000/api/portfolio/profile
```

### Test external access with API key:
```bash
curl http://localhost:3000/api/portfolio/profile \
  -H "Origin: https://external-site.com" \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

### Test external access without key (should fail):
```bash
curl http://localhost:3000/api/portfolio/profile \
  -H "Origin: https://external-site.com"
# Expected: {"error":"Unauthorized","message":"External access requires API key..."}
```

## Benefits

1. **Flexible Access**: Your own site works without any changes
2. **Security**: External sites need authentication
3. **API Key Management**: Use the Settings UI to manage keys
4. **Granular Control**: Can enable/disable keys without redeployment
5. **Tracking**: Last used timestamps for API keys

## Notes

- The guard is **non-breaking** for your existing site (PortfolioContext continues to work)
- Only GET requests need the guard (write operations already require admin auth)
- API keys work for both `/api/mcp` and `/api/portfolio` routes
- Same API keys are used across both endpoints
