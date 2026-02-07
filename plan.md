# Portfolio Data API - Implementation Plan

## Overview
Building a personal portfolio data management application with Next.js, Supabase, and Cloudinary. This is a **single-user application** for managing portfolio content that will later power a public portfolio website.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (owner-only access)
- **Image Storage**: Cloudinary
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Context API (frontend), Server Actions (backend)

## Data Schema

### Core Tables

#### profiles
- `id` (uuid, PK, references auth.users)
- `display_name` (text)
- `headline` (text)
- `bio` (text)
- `location` (text)
- `website` (text)
- `avatar_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### projects
- `id` (bigserial, PK)
- `owner_id` (uuid, FK → profiles.id)
- `title` (text, required)
- `slug` (text, unique, required)
- `short_description` (text)
- `description` (text)
- `live_url` (text)
- `repo_url` (text)
- `primary_image_url` (text)
- `is_published` (boolean, default false)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### project_images
- `id` (bigserial, PK)
- `project_id` (bigint, FK → projects.id, CASCADE)
- `cloudinary_public_id` (text, required)
- `url` (text, required)
- `alt_text` (text)
- `width` (integer)
- `height` (integer)
- `format` (text)
- `position` (integer, default 0)
- `created_at` (timestamp)

#### skills
- `id` (bigserial, PK)
- `name` (text, unique, required)
- `category` (text) // e.g., "Frontend", "Backend", "Tools"
- `logo_url` (text)
- `created_at` (timestamp)

#### project_skills (junction table)
- `project_id` (bigint, FK → projects.id, CASCADE)
- `skill_id` (bigint, FK → skills.id, CASCADE)
- Primary key: (project_id, skill_id)

#### certifications
- `id` (bigserial, PK)
- `profile_id` (uuid, FK → profiles.id)
- `title` (text, required)
- `authority` (text) // Issuing organization
- `credential_url` (text)
- `issued_date` (date)
- `expiration_date` (date, nullable)
- `created_at` (timestamp)

#### education
- `id` (bigserial, PK)
- `profile_id` (uuid, FK → profiles.id)
- `institution` (text, required)
- `degree` (text)
- `field_of_study` (text)
- `start_date` (date)
- `end_date` (date, nullable)
- `grade` (text)
- `description` (text)
- `created_at` (timestamp)

#### experience
- `id` (bigserial, PK)
- `profile_id` (uuid, FK → profiles.id)
- `company` (text, required)
- `title` (text, required)
- `start_date` (date)
- `end_date` (date, nullable)
- `location` (text)
- `description` (text)
- `is_current` (boolean, default false)
- `created_at` (timestamp)

## TypeScript Models

Located in `lib/models/portfolio.ts`:
- `Profile`
- `Project`
- `ProjectImage`
- `Skill`
- `Certification`
- `Education`
- `Experience`

## API Endpoints (Future Phase)

### Projects
- `GET /api/projects` - List all published projects (public)
- `GET /api/projects/:id` - Get project details with images and skills
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Project Images
- `POST /api/projects/:id/images` - Upload image to Cloudinary and link to project
- `DELETE /api/projects/:id/images/:imageId` - Remove image

### Skills
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create skill (auth required)
- `PUT /api/skills/:id` - Update skill (auth required)
- `DELETE /api/skills/:id` - Delete skill (auth required)

### Profile
- `GET /api/profile` - Get owner profile
- `PUT /api/profile` - Update owner profile (auth required)

### Resume Endpoints
- `GET /api/certifications` - List certifications
- `POST /api/certifications` - Create certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification
- Similar CRUD for `/api/education` and `/api/experience`

## Authentication & Authorization

**Single-User Model**: 
- Use Supabase Auth with owner email/password
- Store owner's user ID in environment variable (`OWNER_ID`)
- All write operations require authentication + owner check
- Public read endpoints for published content (for future portfolio website)

## Cloudinary Integration

**Environment Variables**:
- `CLOUDINARY_URL` - Connection string (server-only)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloud name (client-exposed)

**Upload Flow** (Signed):
1. Frontend requests signed upload params from `/api/uploads/cloudinary`
2. Server generates signature using Cloudinary SDK
3. Frontend uploads directly to Cloudinary
4. Frontend sends Cloudinary response to `/api/projects/:id/images` to persist metadata

## Implementation Phases

### Phase 1: Frontend Data Management (Current)
- ✅ Create plan document
- ✅ Define TypeScript models
- ✅ Build admin UI components:
  - Project form
  - Skills form
  - Certification form
  - Experience form
  - Education form
- ✅ Create portfolio context for state management
- ✅ Build management dashboard (`/protected/manage`)
- ✅ Update homepage

### Phase 2: Database Setup
- Create Supabase migrations for all tables
- Set up Row Level Security (RLS) policies
- Create database indexes for performance
- Initialize owner profile

### Phase 3: API Implementation
- Implement CRUD routes for all resources
- Add input validation (Zod schemas)
- Implement Cloudinary upload endpoint
- Add error handling and logging

### Phase 4: Integration
- Connect frontend forms to API endpoints
- Implement image upload UI
- Add loading states and error handling
- Test full CRUD workflows

### Phase 5: Public Portfolio (Future)
- Create public portfolio website (separate route or subdomain)
- Implement read-only API consumption
- Add SEO optimization
- Deploy to production

## Current Status

**Phase 1 in progress** - Building frontend data management UI with local state. No database operations yet.
