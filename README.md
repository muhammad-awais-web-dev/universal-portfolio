# Universal Portfolio

A full-stack personal portfolio system built with **Next.js 16**, **Supabase**, and **Cloudinary**. Includes an admin panel for managing your portfolio data and a public-facing portfolio that visitors can browse.

## Features

### Public Portfolio
- **Home** — Overview of all sections, only shows cards with content
- **Projects** — Filterable by category with search
- **Certifications** — Grid view with active/expired status
- **Education** — Timeline view sorted by date
- **Experience** — Timeline view with current position highlighting
- **Contact Form** — Shown when Resend email service is configured
- **Social Share** — Share project pages to X, LinkedIn, Facebook
- **Dark Mode** — System preference detection + manual toggle

### Admin Panel (`/protected`)
- Manage profile, projects, certifications, education, experience, skills
- Skill categorization with usage counts across all sections
- Project category management with assignment
- Rich text editor for detailed descriptions
- Image management via Cloudinary
- Settings with dev/production mode switch
- Server-side cache management (3-day TTL)

### Technical
- **Caching** — `unstable_cache` with 3-day TTL, clearable from settings
- **MCP API** — External API for reading portfolio data
- **SEO** — Dynamic sitemap, robots.txt, Open Graph + Twitter Card metadata
- **Rate limiting** — Contact form: 3 requests/hour per IP

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase (PostgreSQL) |
| Auth | Custom JWT via Supabase |
| Images | Cloudinary |
| Email | Resend |
| Styling | Tailwind CSS + shadcn/ui |
| Language | TypeScript |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd universal-portfolio
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `JWT_SECRET` | Secret for signing session tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Optional (enables contact form):

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key — get one at [resend.com](https://resend.com) |
| `CONTACT_EMAIL` | Email address to receive contact form messages |

### 3. Run database migrations

Apply the Supabase migrations in `supabase/migrations/` via the Supabase dashboard or CLI.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create an admin account

Visit `/protected/login` and register. The first account becomes the admin.

## Project Structure

```
app/
├── (portfolio pages)       # Public portfolio routes
│   ├── projects/
│   ├── certifications/
│   ├── education/
│   ├── experience/
├── api/                    # API routes
│   ├── portfolio/          # Public portfolio data API
│   ├── mcp/                # MCP external API
│   ├── contact/            # Contact form email handler
│   └── cache/              # Cache management
├── protected/              # Admin panel (auth-gated)
│   ├── manage/             # Data management
│   └── settings/           # Portfolio settings
components/
├── admin/                  # Admin UI components
├── portfolio/              # Public portfolio components
├── settings/               # Settings page components
└── ui/                     # shadcn/ui base components
lib/
├── cache/                  # Caching utilities
├── models/                 # TypeScript interfaces
├── repositories/           # Database access layer
└── utils/                  # Shared utilities
supabase/
└── migrations/             # Database schema migrations
```

## Mode Switching

The portfolio has two modes controlled in **Settings → General**:

- **Development** — Admin sees data management UI. Visitors see a "Coming Soon" page.
- **Published** — Public portfolio is live and visible to all visitors.

## MCP API

An external read-only API is available for integrating portfolio data into other tools (e.g. AI assistants). See [`MCP_API_DOCS.md`](./MCP_API_DOCS.md) for endpoint reference.

## Deployment

Optimized for deployment on **Vercel**. Set all environment variables in your Vercel project settings. The `VERCEL_URL` environment variable is used automatically for absolute URLs in metadata and sitemaps.

```bash
npm run build   # Verify build passes before deploying
```

## License

MIT
