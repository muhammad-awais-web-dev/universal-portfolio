# Database Schema Guide

## Overview
This schema supports a single-user portfolio management system with rich relationships between projects, skills, certifications, education, and experience.

## Schema Summary

### Core Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| **profiles** | Portfolio owner info | full_name, tagline, bio, avatar_url, social links |
| **projects** | Portfolio projects | title, slug, description, body_html, featured_image, image_gallery |
| **project_images** | Image metadata | cloudinary_public_id, url, alt_text, width, height |
| **skills** | Technical/soft skills | name, logo_url, body_html |
| **certifications** | Professional certs | title, authority, credential_url, issued_date, expiration_date |
| **education** | Educational background | institution, degree, field_of_study, dates |
| **experience** | Work experience | company, title, location, dates, description |

### Category Tables
- **project_categories**: Organize projects (Web, Mobile, Data Science, etc.)
- **skill_categories**: Organize skills (Frontend, Backend, DevOps, etc.)

### Junction Tables (Many-to-Many)
- **project_skills**: Projects ↔ Skills
- **project_categories_junction**: Projects ↔ Categories
- **skill_categories_junction**: Skills ↔ Categories
- **certification_skills**: Certifications ↔ Skills
- **certification_projects**: Certifications ↔ Projects
- **education_skills**: Education ↔ Skills
- **education_projects**: Education ↔ Projects
- **experience_skills**: Experience ↔ Skills
- **experience_projects**: Experience ↔ Projects

## Key Features

### 1. Image Management
- **featured_image**: Required Cloudinary URL (stored as TEXT)
- **image_gallery**: Array of Cloudinary URLs (stored as TEXT[])
- **project_images**: Detailed metadata table with:
  - `cloudinary_public_id`: For Cloudinary API operations
  - `alt_text`: Accessibility support
  - `width`, `height`, `format`: Image dimensions
  - `position`: Display order

### 2. Rich Content
All main entities support `body_html` for rich text content (HTML from rich text editors).

### 3. Publication Status
- **projects**: `is_published` flag + `published_at` timestamp
- **certifications**: `is_active` flag for expired/revoked certs

### 4. Relationships
- **owner_id**: Links entities to profile (UUID foreign key)
- **Junction tables**: Enable many-to-many relationships between entities
- **Cascading deletes**: Clean up related data automatically

### 5. Row Level Security (RLS)
- **Public read**: Enabled for published content
- **Admin writes**: Use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Future: Add user-specific policies if needed

### 6. Auto-Timestamps
- `created_at`: Auto-set on insert
- `updated_at`: Auto-updated on row changes (profiles, projects)

## Applying the Migration

### Option 1: Supabase Dashboard (Recommended for first-time)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run** to execute

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (use project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Apply migration
supabase db push

# Or run the migration file directly
supabase db execute -f supabase/migrations/001_initial_schema.sql
```

### Option 3: Direct SQL Execution
```bash
# Using psql (if you have direct connection)
psql postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres -f supabase/migrations/001_initial_schema.sql
```

## Verification

After applying the migration, verify tables were created:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check profiles table (should have 1 seed row)
SELECT * FROM profiles;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Next Steps

1. ✅ Apply this migration to create tables
2. Create Zod validation schemas (`lib/schemas/portfolio.ts`)
3. Build API routes that use these tables (`app/api/portfolio/*`)
4. Update frontend to call APIs instead of localStorage
5. Add migration endpoint to transfer localStorage data to DB

## Notes

- **UUID for profiles**: Uses `00000000-0000-0000-0000-000000000000` as default single-user ID
- **Serial IDs**: All other entities use auto-incrementing integers
- **Text arrays**: `image_gallery` uses PostgreSQL TEXT[] for flexibility
- **Cascading deletes**: Deleting a profile/project removes all related data
- **Service role key**: Required for admin write operations from Next.js API routes

## Schema Diagram

```
profiles (1)
  ↓
  ├─→ projects (many)
  │     ├─→ project_images (many)
  │     ├─→ project_skills → skills
  │     └─→ project_categories_junction → project_categories
  │
  ├─→ certifications (many)
  │     ├─→ certification_skills → skills
  │     └─→ certification_projects → projects
  │
  ├─→ education (many)
  │     ├─→ education_skills → skills
  │     └─→ education_projects → projects
  │
  └─→ experience (many)
        ├─→ experience_skills → skills
        └─→ experience_projects → projects

skills (many)
  └─→ skill_categories_junction → skill_categories
```
