# Portfolio Manager - Architecture Documentation

## Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **State Management:** React Context API

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **API:** Next.js Route Handlers
- **Image Storage:** Cloudinary

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Type Checking:** TypeScript

---

## Project Structure

```
universal-portfolio/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── auth/                       # Auth pages (signup, login, etc.)
│   └── protected/
│       ├── layout.tsx              # Protected layout
│       └── manage/
│           └── page.tsx            # Management dashboard
│
├── components/
│   ├── admin/                      # Admin/management components
│   │   ├── portfolio-context.tsx  # State management
│   │   ├── bio-form.tsx           # Bio/profile form
│   │   ├── project-form.tsx       # Project management
│   │   ├── skill-form.tsx         # Skills management
│   │   ├── certification-form.tsx # Certifications
│   │   ├── experience-form.tsx    # Work experience
│   │   └── education-form.tsx     # Education
│   │
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/
│   ├── models/
│   │   └── portfolio.ts            # TypeScript data models
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── proxy.ts                # Middleware
│   └── utils.ts                     # Utility functions
│
├── plan.md                          # Project plan
├── PROGRESS.md                      # Progress tracking
├── TODO.md                          # Task list
└── ARCHITECTURE.md                  # This file
```

---

## Data Models

### Profile
Personal information and contact details.
```typescript
interface Profile {
  id: string;
  full_name?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Project
Portfolio projects with images and skills.
```typescript
interface Project {
  id: number;
  owner_id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  live_url?: string;
  repo_url?: string;
  featured_image: string;           // Required
  is_published?: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Relationships
  skill_ids?: number[];
  images?: ProjectImage[];           // Additional images
}
```

### ProjectImage
Images associated with projects/certifications.
```typescript
interface ProjectImage {
  id: number;
  project_id: number;
  cloudinary_public_id: string;
  url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  format?: string;
  position?: number;
  created_at?: string;
}
```

### Skill
Technical skills and competencies.
```typescript
interface Skill {
  id: number;
  name: string;
  category?: string;                 // Frontend, Backend, Tools, etc.
  logo_url?: string;
  created_at?: string;
}
```

### Certification
Professional certifications.
```typescript
interface Certification {
  id: number;
  profile_id: string;
  title: string;
  authority?: string;
  credential_url?: string;
  issued_date?: string;
  expiration_date?: string | null;
  featured_image: string;            // Required
  is_active?: boolean;
  created_at?: string;
  // Relationships
  skill_ids?: number[];
  project_ids?: number[];
  images?: ProjectImage[];           // Optional additional images
}
```

### Experience
Work experience history.
```typescript
interface Experience {
  id: number;
  profile_id: string;
  company: string;
  title: string;
  start_date?: string;
  end_date?: string | null;
  location?: string;
  description?: string;
  is_current?: boolean;
  created_at?: string;
  // Relationships
  skill_ids?: number[];
  project_ids?: number[];
}
```

### Education
Academic background.
```typescript
interface Education {
  id: number;
  profile_id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean;
  grade?: string;
  description?: string;
  created_at?: string;
  // Relationships
  skill_ids?: number[];
  project_ids?: number[];
}
```

---

## Data Relationships

### Skills → Everything
Skills are the central entity that connects to:
- Projects (many-to-many)
- Certifications (many-to-many)
- Experience (many-to-many)
- Education (many-to-many)

### Projects ← Certifications, Experience, Education
Projects can be referenced by:
- Certifications (projects where cert was applied)
- Experience (projects completed during job)
- Education (projects completed during studies)

### Images
- Profile has one avatar
- Projects have one featured image + multiple optional images
- Certifications have one featured image + multiple optional images

---

## State Management

### Current Implementation (Phase 1)
**Context API with Local State**

```typescript
PortfolioContext provides:
- profile: Profile | null
- updateProfile(profile: ProfileFormData)
- projects: Project[]
- addProject(project: ProjectFormData)
- updateProject(id: number, project: Partial<ProjectFormData>)
- deleteProject(id: number)
// ... similar for skills, certifications, experience, education
```

**Data Flow:**
1. User interacts with form
2. Form component calls context method
3. Context updates local state
4. React re-renders affected components

### Future Implementation (Phase 3)
**Context API + Supabase Backend**

```typescript
Context will call API routes:
- POST /api/profile → updateProfile
- GET /api/projects → loadProjects
- POST /api/projects → addProject
- PUT /api/projects/:id → updateProject
- DELETE /api/projects/:id → deleteProject
// ... similar for other entities
```

**Data Flow:**
1. User interacts with form
2. Form calls context method
3. Context makes API call (fetch/axios)
4. API route validates and saves to Supabase
5. API returns updated data
6. Context updates local cache
7. React re-renders

---

## Image Upload Flow (Cloudinary)

### Signed Upload (Recommended)
```
1. User selects image in form
2. Frontend requests signed upload params from API
   POST /api/uploads/cloudinary
   → returns { signature, timestamp, cloudName, uploadPreset }
3. Frontend uploads directly to Cloudinary
   → returns { public_id, url, width, height, format }
4. Frontend saves image metadata to database
   POST /api/projects/:id/images { cloudinary_public_id, url, ... }
5. Display image from Cloudinary CDN
```

### Components Needed
- `ImageUpload` component (reusable)
- `ImageGallery` component (display & manage)
- `/api/uploads/cloudinary` route (generate signatures)
- Image metadata persistence in Supabase

---

## Authentication Flow

### Current State (Phase 1)
Authentication is **disabled** for UI development.
- Middleware redirect commented out
- No login required
- All routes accessible

### Future State (Phase 3)
Authentication will be **re-enabled** with:
- Supabase Auth (password-based)
- Owner-only access (single user)
- `OWNER_ID` environment variable for RBAC
- Middleware redirects unauthenticated users

---

## API Routes (Future)

### Profile
- `GET /api/profile` - Get owner profile
- `PUT /api/profile` - Update profile

### Projects
- `GET /api/projects` - List projects (public or filtered)
- `POST /api/projects` - Create project (auth)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (auth)
- `DELETE /api/projects/:id` - Delete project (auth)

### Project Images
- `POST /api/projects/:id/images` - Add image (auth)
- `DELETE /api/projects/:id/images/:imageId` - Remove image (auth)

### Skills
- `GET /api/skills` - List skills
- `POST /api/skills` - Create skill (auth)
- `PUT /api/skills/:id` - Update skill (auth)
- `DELETE /api/skills/:id` - Delete skill (auth)

### Similar routes for:
- Certifications
- Experience
- Education

---

## Database Schema (Supabase)

### Tables to Create
1. `profiles` - User profile information
2. `projects` - Portfolio projects
3. `project_images` - Project image metadata
4. `skills` - Technical skills
5. `project_skills` - Many-to-many junction
6. `certifications` - Professional certifications
7. `certification_skills` - Many-to-many junction
8. `certification_projects` - Many-to-many junction
9. `education` - Academic history
10. `education_skills` - Many-to-many junction
11. `education_projects` - Many-to-many junction
12. `experience` - Work history
13. `experience_skills` - Many-to-many junction
14. `experience_projects` - Many-to-many junction

### Row Level Security (RLS)
- Owner can read/write all data
- Public can read published projects only
- All other data private to owner

---

## Environment Variables

### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Owner Authentication (Phase 3)
OWNER_ID=uuid-of-owner-user
```

---

## Development Workflow

### Current Phase (Cloudinary Integration)
1. Work on `cloudinary-implementation` branch
2. Implement image upload components
3. Test with Cloudinary
4. Commit and push regularly
5. Merge to main when complete

### General Workflow
1. Create feature branch from main
2. Implement feature
3. Test locally
4. Commit with descriptive message
5. Push to remote
6. Create PR (if needed)
7. Merge to main

---

## Deployment (Future)

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push
4. Configure custom domain

### Database
- Supabase hosted (already provisioned)
- Run migrations via Supabase CLI or dashboard

### Images
- Cloudinary hosted (CDN)
- No additional setup needed

---

## Testing Strategy (Future)

### Unit Tests
- Test individual components
- Test utility functions
- Test data transformations

### Integration Tests
- Test form submissions
- Test API endpoints
- Test database operations

### E2E Tests
- Test complete user workflows
- Test authentication flow
- Test image upload flow

---

## Performance Considerations

### Frontend
- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load images
- Code splitting for routes

### Backend
- Index frequently queried fields
- Use Supabase edge functions for complex queries
- Implement caching where appropriate
- Optimize image sizes with Cloudinary transformations

### Images
- Generate responsive image sizes
- Use webp format
- Implement lazy loading
- Use Cloudinary CDN for fast delivery

---

## Security Considerations

### Authentication
- Use Supabase Auth (secure by default)
- Implement proper session management
- Use HTTP-only cookies

### Authorization
- Implement RLS policies in Supabase
- Verify ownership in API routes
- Never trust client-side data

### Image Uploads
- Use signed uploads (prevent unauthorized uploads)
- Validate file types and sizes
- Sanitize filenames
- Use Cloudinary's moderation features

### Data Validation
- Validate all inputs (Zod schemas)
- Sanitize user-generated content
- Use parameterized queries (Supabase handles this)

---

## Monitoring & Logging (Future)

### Application Monitoring
- Vercel Analytics
- Sentry for error tracking
- Custom logging for API routes

### Database Monitoring
- Supabase Dashboard
- Query performance tracking
- Connection pool monitoring

### Image Storage
- Cloudinary Dashboard
- Usage and bandwidth tracking
- Transformation performance

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor Supabase usage
- Monitor Cloudinary usage
- Review and optimize queries
- Backup database regularly

### Documentation
- Keep architecture docs updated
- Document new features
- Update API documentation
- Maintain changelog

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Support
- Next.js GitHub Issues
- Supabase Discord
- Cloudinary Support
- Stack Overflow
