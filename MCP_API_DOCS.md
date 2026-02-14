# Universal Portfolio MCP Server

## Overview
This MCP (Model Context Protocol) server provides read-only API access to your portfolio data for AI agents. All endpoints require authentication via API key.

## Quick Start

### 1. Generate API Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configure Environment Variables
Add to `.env.local`:
```bash
MCP_API_KEY=<your-generated-key>
MCP_ENABLED=true
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 3. Deploy to Vercel
```bash
# Add environment variables in Vercel dashboard
vercel env add MCP_API_KEY
vercel env add MCP_ENABLED

# Deploy
vercel --prod
```

## API Endpoints

### Manifest
Discover all available tools and their schemas.

**Endpoint:** `GET /api/mcp/manifest`

**Example:**
```bash
curl https://your-site.vercel.app/api/mcp/manifest \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

### Profile
Get portfolio owner's profile information.

**Endpoint:** `GET /api/mcp/profile`

**Example:**
```bash
curl https://your-site.vercel.app/api/mcp/profile \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "full_name": "John Doe",
    "tagline": "Full Stack Developer",
    "bio": "...",
    "email": "john@example.com",
    "github": "johndoe",
    "linkedin": "johndoe"
  },
  "timestamp": "2026-02-13T17:00:00.000Z"
}
```

### Projects

#### List Projects
**Endpoint:** `GET /api/mcp/projects`

**Query Parameters:**
- `category` (optional): Filter by category name
- `skill` (optional): Filter by skill name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 50)

**Example:**
```bash
# List all projects
curl https://your-site.vercel.app/api/mcp/projects \
  -H "x-mcp-api-key: YOUR_API_KEY"

# Filter by category with pagination
curl "https://your-site.vercel.app/api/mcp/projects?category=Web&page=1&limit=5" \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

#### Get Project
**Endpoint:** `GET /api/mcp/projects/{id-or-slug}`

**Example:**
```bash
# By ID
curl https://your-site.vercel.app/api/mcp/projects/123 \
  -H "x-mcp-api-key: YOUR_API_KEY"

# By slug
curl https://your-site.vercel.app/api/mcp/projects/my-awesome-project \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

### Skills

#### List Skills
**Endpoint:** `GET /api/mcp/skills`

**Query Parameters:**
- `category` (optional): Filter by category name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Example:**
```bash
curl https://your-site.vercel.app/api/mcp/skills \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

#### Get Skill
**Endpoint:** `GET /api/mcp/skills/{id-or-name}`

**Example:**
```bash
# By ID
curl https://your-site.vercel.app/api/mcp/skills/5 \
  -H "x-mcp-api-key: YOUR_API_KEY"

# By name
curl https://your-site.vercel.app/api/mcp/skills/TypeScript \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

### Certifications

#### List Certifications
**Endpoint:** `GET /api/mcp/certifications`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 50)

**Example:**
```bash
curl https://your-site.vercel.app/api/mcp/certifications \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

#### Get Certification
**Endpoint:** `GET /api/mcp/certifications/{id}`

### Education

#### List Education
**Endpoint:** `GET /api/mcp/education`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 50)

#### Get Education
**Endpoint:** `GET /api/mcp/education/{id}`

### Experience

#### List Experience
**Endpoint:** `GET /api/mcp/experience`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 50)

#### Get Experience
**Endpoint:** `GET /api/mcp/experience/{id}`

### Testimonials

#### List Testimonials
**Endpoint:** `GET /api/mcp/testimonials`

**Query Parameters:**
- `featured` (optional): Filter for featured testimonials (`true`/`false`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 50)

**Example:**
```bash
# List featured testimonials
curl "https://your-site.vercel.app/api/mcp/testimonials?featured=true" \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

#### Get Testimonial
**Endpoint:** `GET /api/mcp/testimonials/{id}`

## Response Format

All endpoints return JSON in this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-02-13T17:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-02-13T17:00:00.000Z"
}
```

## Authentication

All requests must include the API key in the header:
```
x-mcp-api-key: YOUR_API_KEY
```

**Unauthorized Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key",
  "timestamp": "2026-02-13T17:00:00.000Z"
}
```

## AI Agent Configuration

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "portfolio": {
      "url": "https://your-site.vercel.app/api/mcp",
      "headers": {
        "x-mcp-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```

### Custom MCP Client
```typescript
const response = await fetch('https://your-site.vercel.app/api/mcp/projects', {
  headers: {
    'x-mcp-api-key': process.env.MCP_API_KEY,
  },
});

const { success, data, error } = await response.json();
```

## Data Filtering

The MCP server enforces the following filters:
- **Projects**: Only published projects (`is_published = true`)
- **Testimonials**: Only active testimonials (`is_active = true`)
- **Certifications**: Only active certifications (`is_active = true`)

## Security Notes

1. **Never commit** your API key to version control
2. **Store securely** in environment variables
3. **Rotate regularly** if compromised
4. **Use HTTPS** - API keys sent over HTTP can be intercepted
5. **Monitor usage** via Vercel analytics

## Rate Limiting

Vercel serverless functions have built-in rate limiting:
- Free tier: 100 requests per 10 seconds per IP
- Pro tier: Higher limits available

## Troubleshooting

**401 Unauthorized:**
- Check API key is set in environment variables
- Verify `MCP_ENABLED=true` is set
- Ensure header is `x-mcp-api-key` (case-sensitive)

**500 Internal Server Error:**
- Check Supabase credentials are correct
- Verify database migrations have been applied
- Check Vercel function logs for details

**Empty Results:**
- Ensure you have published projects/active testimonials in database
- Check RLS policies in Supabase

## Development

### Local Testing
```bash
# Install dependencies
npm install

# Set up .env.local
cp .env.example .env.local
# Edit .env.local with your keys

# Run dev server
npm run dev

# Test endpoint
curl http://localhost:3000/api/mcp/profile \
  -H "x-mcp-api-key: YOUR_API_KEY"
```

### Adding New Endpoints

1. Add tool schema to `lib/mcp/schemas.ts`
2. Add service function to `lib/mcp/service.ts`
3. Create API route in `app/api/mcp/{name}/route.ts`
4. Use `withAuth()` wrapper for authentication
5. Return responses via `mcpResponse()` helper

## Support

For issues or questions:
1. Check Vercel function logs
2. Verify environment variables
3. Test Supabase connection
4. Review API response error messages
