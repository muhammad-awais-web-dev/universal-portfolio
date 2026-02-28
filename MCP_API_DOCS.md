# API Endpoint Testing Guide

## Overview

This guide shows how to test your portfolio API endpoints using `curl` in the terminal.

## Prerequisites

1. **Dev server must be running:**
   ```bash
   npm run dev
   ```

2. **Base URL:** `http://localhost:3000`

## Authentication Methods

### Method 1: MCP API Key (Read-Only)
For MCP endpoints that don't require user authentication:

```bash
API_KEY="YOUR_MCP_API_KEY_HERE"
```

### Method 2: Session Cookies (Full Access)
For portfolio endpoints that require authentication:

```bash
# First, login via browser and export cookies
# Chrome: Install "EditThisCookie" extension
# Firefox: Use "Cookie Quick Manager" extension
# Export cookies to cookies.txt in Netscape format
```

## API Endpoints

### 1. Portfolio Data (Public/Published)

#### Get All Portfolio Data
```bash
# No auth needed - returns published data only
curl -X GET http://localhost:3000/api/portfolio
```

#### Get Specific Project by Slug
```bash
curl -X GET "http://localhost:3000/api/portfolio?slug=linkedin-comment"
```

### 2. MCP Endpoints (Read-Only with API Key)

#### List All Skills
```bash
curl -X GET http://localhost:3000/api/mcp/skills \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### Get Single Skill
```bash
curl -X GET http://localhost:3000/api/mcp/skills/SKILL_ID \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List All Projects
```bash
curl -X GET http://localhost:3000/api/mcp/projects \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List All Certifications
```bash
curl -X GET http://localhost:3000/api/mcp/certifications \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List All Education
```bash
curl -X GET http://localhost:3000/api/mcp/education \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List All Experience
```bash
curl -X GET http://localhost:3000/api/mcp/experience \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List Skill Categories
```bash
curl -X GET http://localhost:3000/api/mcp/skill-categories \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

#### List Project Categories
```bash
curl -X GET http://localhost:3000/api/mcp/project-categories \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE"
```

### 3. Protected Portfolio Endpoints (Requires Auth)

**Note:** These require valid session cookies. You need to be logged in.

#### Create New Skill
```bash
curl -X POST http://localhost:3000/api/portfolio/skills \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Technology",
    "category_ids": [1]
  }'
```

#### Update Skill
```bash
curl -X PUT http://localhost:3000/api/portfolio/skills/SKILL_ID \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "category_ids": [1, 2]
  }'
```

#### Delete Skill
```bash
curl -X DELETE http://localhost:3000/api/portfolio/skills/SKILL_ID \
  -b cookies.txt
```

#### Create New Project
```bash
curl -X POST http://localhost:3000/api/portfolio/projects \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "slug": "test-project",
    "description": "A test project",
    "body": "<p>Full description here</p>",
    "is_published": false,
    "skill_ids": [1, 2, 3],
    "category_ids": [1]
  }'
```

#### Update Project
```bash
curl -X PUT http://localhost:3000/api/portfolio/projects/PROJECT_ID \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "is_published": true
  }'
```

## Useful Testing Patterns

### 1. Pretty Print JSON Response
```bash
curl -X GET http://localhost:3000/api/portfolio | jq '.'
```

### 2. Save Response to File
```bash
curl -X GET http://localhost:3000/api/portfolio > response.json
```

### 3. Check Only HTTP Status
```bash
curl -X GET http://localhost:3000/api/portfolio -w "\nHTTP Status: %{http_code}\n" -o /dev/null -s
```

### 4. Test with Verbose Output
```bash
curl -v -X GET http://localhost:3000/api/portfolio
```

### 5. Filter Specific Field with jq
```bash
# Get only project titles
curl -X GET http://localhost:3000/api/portfolio | jq '.projects[].title'

# Count skills
curl -X GET http://localhost:3000/api/portfolio | jq '.skills | length'

# Get skills in specific category
curl -X GET http://localhost:3000/api/mcp/skills \
  -H "x-api-key: YOUR_KEY" | \
  jq '.skills[] | select(.category_ids | contains([1]))'
```

## Testing Scenarios

### Scenario 1: Verify Skill Categorization
```bash
# After running assign-all-skills.sql
curl -X GET http://localhost:3000/api/mcp/skills \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE" | \
  jq '[.skills[] | {name: .name, categories: .category_ids}] | .[0:10]'
```

### Scenario 2: Check Published Projects
```bash
# Public endpoint - should only return published
curl -X GET http://localhost:3000/api/portfolio | \
  jq '.projects[] | {title: .title, published: .is_published}'
```

### Scenario 3: Verify Project Categories
```bash
# After running assign-project-categories.sql
curl -X GET http://localhost:3000/api/mcp/projects \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE" | \
  jq '.projects[] | {title: .title, categories: .category_ids}'
```

### Scenario 4: Test Skill Usage Counts
```bash
# Get skills with their IDs to verify counts in UI
curl -X GET http://localhost:3000/api/mcp/skills \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE" | \
  jq '.skills[] | {id: .id, name: .name, usage: (.skill_ids // [] | length)}'
```

## Environment Setup

### Install jq (JSON processor)
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Verify installation
jq --version
```

### Create Cookies File

#### Option 1: Export from Browser
1. Login to your app at `http://localhost:3000`
2. Install cookie extension (EditThisCookie for Chrome)
3. Export cookies in Netscape format
4. Save as `cookies.txt` in project root

#### Option 2: Manual Cookie Extraction
```bash
# In browser DevTools → Application → Cookies
# Copy the session cookie value and create:
echo "localhostFALSE/FALSE0next-auth.session-tokenYOUR_TOKEN_HERE" > cookies.txt
```

## Common Issues

### Issue 1: "Unauthorized" Response
**Solution:** Make sure you're using the correct API key or have valid session cookies

```bash
# Test MCP endpoint
curl -X GET http://localhost:3000/api/mcp/skills \
  -H "x-api-key: YOUR_MCP_API_KEY_HERE" -v
```

### Issue 2: "Method Not Allowed"
**Solution:** MCP endpoints are READ-ONLY, use portfolio endpoints for mutations

```bash
# ❌ Wrong - MCP endpoints don't support POST
curl -X POST http://localhost:3000/api/mcp/skills ...

# ✅ Correct - Use portfolio endpoint
curl -X POST http://localhost:3000/api/portfolio/skills -b cookies.txt ...
```

### Issue 3: CORS Errors
**Solution:** Use `-H "Origin: http://localhost:3000"` for browser-like requests

```bash
curl -X GET http://localhost:3000/api/portfolio \
  -H "Origin: http://localhost:3000"
```

### Issue 4: Cookie File Not Working
**Solution:** Check cookie file format (must be Netscape format)

```bash
# Verify cookie file format
cat cookies.txt

# Should look like:
# localhostFALSE/FALSE0cookie_namecookie_value
```

## Quick Reference

### Available Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/portfolio` | GET | None | Get published portfolio data |
| `/api/mcp/skills` | GET | API Key | List all skills |
| `/api/mcp/projects` | GET | API Key | List all projects |
| `/api/mcp/certifications` | GET | API Key | List all certifications |
| `/api/mcp/education` | GET | API Key | List all education |
| `/api/mcp/experience` | GET | API Key | List all experience |
| `/api/mcp/skill-categories` | GET | API Key | List skill categories |
| `/api/mcp/project-categories` | GET | API Key | List project categories |
| `/api/portfolio/skills` | POST/PUT/DELETE | Cookies | Manage skills |
| `/api/portfolio/projects` | POST/PUT/DELETE | Cookies | Manage projects |
| `/api/portfolio/certifications` | POST/PUT/DELETE | Cookies | Manage certifications |
| `/api/portfolio/education` | POST/PUT/DELETE | Cookies | Manage education |
| `/api/portfolio/experience` | POST/PUT/DELETE | Cookies | Manage experience |

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (check your JSON)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (valid auth, insufficient permissions)
- `404` - Not Found
- `405` - Method Not Allowed (wrong HTTP method)
- `500` - Internal Server Error

---

**Created:** February 17, 2026  
**Version:** 1.0  
**API Key (Read-Only):** `YOUR_MCP_API_KEY_HERE`
