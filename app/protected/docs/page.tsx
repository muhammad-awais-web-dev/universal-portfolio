'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Rocket, Star, Puzzle, BookOpen, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Section metadata ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'recommended', label: 'Recommended Features', icon: Star },
  { id: 'optional', label: 'Optional Features', icon: Puzzle },
  { id: 'usage', label: 'Usage Guide', icon: BookOpen },
  { id: 'mcp', label: 'MCP API Reference', icon: Cpu },
];

// ─── Prose helpers ─────────────────────────────────────────────────────────────
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-foreground mb-4">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-3">
      <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
        {n}
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 mr-1 font-mono">
      {children}
    </span>
  );
}
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">
      {children}
    </code>
  );
}
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-muted-foreground bg-muted rounded-md p-3 mb-4 leading-relaxed">
      {children}
    </div>
  );
}

// ─── Section content ──────────────────────────────────────────────────────────
function GettingStarted() {
  return (
    <>
      <H2>Getting Started</H2>
      <P>
        Welcome to your portfolio admin panel. Follow these steps to get your portfolio live and
        looking great.
      </P>
      <Step n={1}>
        <span>
          <strong>Fill in your Bio & Profile</strong> — Go to{' '}
          <strong>Content → Bio & Profile</strong> and add your name, tagline, bio, location, and
          social links (GitHub, LinkedIn, Twitter). Upload an avatar photo.
        </span>
      </Step>
      <Step n={2}>
        <span>
          <strong>Add your Skills</strong> — Go to <strong>Content → Skills</strong> and add the
          technologies and tools you work with. You can add a logo URL for each skill.
        </span>
      </Step>
      <Step n={3}>
        <span>
          <strong>Create your first Project</strong> — Go to <strong>Content → Projects</strong>,
          click <em>Add Project</em>, fill in the title, description, live URL, and repo URL. Toggle
          <em>Published</em> to make it visible.
        </span>
      </Step>
      <Step n={4}>
        <span>
          <strong>Configure General Settings</strong> — Go to <strong>Settings → General</strong>{' '}
          and set your site name, logo, and branding.
        </span>
      </Step>
      <Step n={5}>
        <span>
          <strong>Preview your portfolio</strong> — Click <strong>View Site</strong> in the top
          bar to see your live portfolio.
        </span>
      </Step>
      <Step n={6}>
        <span>
          <strong>Generate an MCP API Key</strong> (optional) — Go to{' '}
          <strong>Settings → API Keys</strong> to create a key that lets AI assistants (like GitHub
          Copilot) manage your portfolio.
        </span>
      </Step>
    </>
  );
}

function RecommendedFeatures() {
  return (
    <>
      <H2>Recommended Features</H2>
      <P>These features make the biggest difference to how your portfolio looks and feels.</P>

      <H3>Profile Photo & Avatar</H3>
      <P>
        Add a high-quality avatar photo in <strong>Bio & Profile</strong>. Use a square image
        (400×400 px minimum) for best results. Paste an image URL or upload via the Media Library.
      </P>

      <H3>Featured Projects</H3>
      <P>
        Mark your best 3–5 projects as <em>Published</em> and add a featured image to each. These
        appear prominently on your portfolio homepage.
      </P>

      <H3>Social Links</H3>
      <P>
        Add at least GitHub and LinkedIn links in <strong>Bio & Profile</strong>. These are
        displayed as icons on your portfolio and increase credibility.
      </P>

      <H3>Testimonials</H3>
      <P>
        Add testimonials from colleagues, clients, or managers in{' '}
        <strong>Content → Testimonials</strong>. Toggle <em>Featured</em> to highlight the best
        ones. They display in a carousel on your portfolio.
      </P>

      <H3>Work Experience</H3>
      <P>
        Add your work history in <strong>Content → Experience</strong>. Include your current role
        and mark <em>Current</em> — this helps visitors understand where you are right now.
      </P>
    </>
  );
}

function OptionalFeatures() {
  return (
    <>
      <H2>Optional Features</H2>
      <P>These features are not required but significantly enhance your portfolio.</P>

      <H3>Cloudinary — Image Hosting</H3>
      <P>
        Connect your Cloudinary account in <strong>Integrations</strong> to enable direct image
        uploads from the Media Library. Without this, you use external image URLs.
      </P>
      <InfoBox>
        <strong>Setup:</strong> Create a free Cloudinary account → copy your Cloud Name, API Key,
        and API Secret → paste into Integrations → Cloudinary.
      </InfoBox>

      <H3>Resend — Contact Form Email</H3>
      <P>
        Connect Resend in <strong>Integrations</strong> to receive messages from your portfolio
        contact form via email.
      </P>
      <InfoBox>
        <strong>Setup:</strong> Create a free Resend account → create an API key → paste into
        Integrations → Resend. Set your &quot;From&quot; email address too.
      </InfoBox>

      <H3>Certifications & Education</H3>
      <P>
        Add your certifications and education history. These sections are optional but valuable for
        recruiters. You can link certifications to credential URLs and skills.
      </P>

      <H3>Media Library</H3>
      <P>
        Use <strong>Media Library</strong> to manage uploaded images. With Cloudinary connected, you
        can upload directly. Images can be referenced by URL in projects, skills, and your profile.
      </P>

      <H3>MCP API Access</H3>
      <P>
        Generate API keys in <strong>Settings → API Keys</strong> to allow AI assistants to read or
        update your portfolio programmatically. See the <em>MCP API Reference</em> section for
        details.
      </P>
    </>
  );
}

function UsageGuide() {
  return (
    <>
      <H2>Usage Guide</H2>

      <H3>Managing Content</H3>
      <P>
        All portfolio content (projects, skills, experience, etc.) is managed under the{' '}
        <strong>Content</strong> section in the sidebar. Each section shows a list of items with
        Add / Edit / Delete controls.
      </P>

      <H3>Publishing Items</H3>
      <P>
        Most items (projects, testimonials) have a <em>Published</em> toggle. Only published items
        appear on your public portfolio. Use drafts to work on content before making it live.
      </P>

      <H3>Skill Relationships</H3>
      <P>
        Skills can be linked to Projects, Experience, Education, and Certifications. When editing
        any of these, you can select related skills. This enables filtering on your portfolio.
      </P>

      <H3>Settings Overview</H3>
      <P>
        <strong>General</strong> — site name, logo, theme, social preview image.
        <br />
        <strong>API Keys</strong> — create and manage MCP API keys with read-only or write access.
        <br />
        <strong>Credentials</strong> — update your admin email and password.
        <br />
        <strong>Database</strong> — view schema information and run migrations.
      </P>

      <H3>Keyboard Shortcuts</H3>
      <div className="rounded-md border divide-y text-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-muted-foreground">Open search</span>
          <span className="flex gap-1"><Chip>⌘K</Chip><Chip>Ctrl+K</Chip></span>
        </div>
      </div>
    </>
  );
}

function McpReference() {
  const tools = [
    { name: 'get_profile', access: 'read', desc: 'Get the portfolio owner profile.' },
    { name: 'update_profile', access: 'write', desc: 'Update name, bio, tagline, social links, avatar, etc.' },
    { name: 'list_projects', access: 'read', desc: 'List published projects. Filter by category or skill.' },
    { name: 'get_project', access: 'read', desc: 'Get a project by ID or slug.' },
    { name: 'create_project', access: 'write', desc: 'Create a new project with title, description, URLs, skills, and categories.' },
    { name: 'update_project', access: 'write', desc: 'Update any project field including body_html, image_gallery, and published_at.' },
    { name: 'delete_project', access: 'write', desc: 'Permanently delete a project.' },
    { name: 'list_skills', access: 'read', desc: 'List all skills, optionally filtered by category.' },
    { name: 'get_skill', access: 'read', desc: 'Get a skill by ID or name.' },
    { name: 'create_skill', access: 'write', desc: 'Create a new skill with optional logo and HTML description.' },
    { name: 'update_skill', access: 'write', desc: 'Update a skill.' },
    { name: 'delete_skill', access: 'write', desc: 'Delete a skill.' },
    { name: 'list_certifications', access: 'read', desc: 'List all certifications.' },
    { name: 'create_certification', access: 'write', desc: 'Create a certification with title, authority, date, and credential URL.' },
    { name: 'update_certification', access: 'write', desc: 'Update a certification.' },
    { name: 'delete_certification', access: 'write', desc: 'Delete a certification.' },
    { name: 'list_education', access: 'read', desc: 'List all education entries.' },
    { name: 'create_education', access: 'write', desc: 'Create an education entry.' },
    { name: 'update_education', access: 'write', desc: 'Update an education entry.' },
    { name: 'delete_education', access: 'write', desc: 'Delete an education entry.' },
    { name: 'list_experience', access: 'read', desc: 'List all work experience entries.' },
    { name: 'create_experience', access: 'write', desc: 'Create a work experience entry.' },
    { name: 'update_experience', access: 'write', desc: 'Update a work experience entry.' },
    { name: 'delete_experience', access: 'write', desc: 'Delete a work experience entry.' },
    { name: 'list_testimonials', access: 'read', desc: 'List testimonials. Filter by featured.' },
    { name: 'create_testimonial', access: 'write', desc: 'Create a testimonial.' },
    { name: 'update_testimonial', access: 'write', desc: 'Update a testimonial.' },
    { name: 'delete_testimonial', access: 'write', desc: 'Delete a testimonial.' },
  ];

  return (
    <>
      <H2>MCP API Reference</H2>
      <P>
        The MCP (Model Context Protocol) API lets AI assistants like GitHub Copilot read and manage
        your portfolio. Generate an API key in <strong>Settings → API Keys</strong>.
      </P>

      <H3>Authentication</H3>
      <P>
        Pass your API key in the <Code>x-api-key</Code> header (or{' '}
        <Code>Authorization: Bearer …</Code>). Read-only keys can call <Code>list_*</Code> and{' '}
        <Code>get_*</Code> tools only. Write keys can call all tools.
      </P>

      <H3>MCP Server URL</H3>
      <div className="bg-muted rounded-md px-4 py-3 mb-6 font-mono text-sm break-all">
        https://your-domain.com/api/mcp
      </div>

      <H3>Available Tools</H3>
      <div className="rounded-md border overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_2fr] text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-4 py-2 border-b">
          <span>Access</span>
          <span>Tool</span>
          <span>Description</span>
        </div>
        {tools.map((t) => (
          <div
            key={t.name}
            className="grid grid-cols-[80px_1fr_2fr] items-start px-4 py-2.5 border-b last:border-0 text-sm hover:bg-muted/30"
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded w-fit mt-0.5',
                t.access === 'write'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              )}
            >
              {t.access}
            </span>
            <code className="font-mono text-xs text-foreground">{t.name}</code>
            <span className="text-xs text-muted-foreground">{t.desc}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const SECTION_CONTENT: Record<string, React.ReactNode> = {
  'getting-started': <GettingStarted />,
  recommended: <RecommendedFeatures />,
  optional: <OptionalFeatures />,
  usage: <UsageGuide />,
  mcp: <McpReference />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
function DocsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') ?? 'getting-started';

  const setSection = (id: string) => {
    router.push(`/protected/docs?section=${id}`);
  };

  return (
    <div className="flex gap-0 h-full -m-6 overflow-hidden">
      {/* Section nav */}
      <nav className="w-52 shrink-0 border-r h-full overflow-y-auto py-4 px-2 space-y-0.5">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Documentation
        </p>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors',
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl">
        {SECTION_CONTENT[activeSection] ?? SECTION_CONTENT['getting-started']}
      </main>
    </div>
  );
}

export default function DocsPage() {
  return (
    <Suspense fallback={null}>
      <DocsPageInner />
    </Suspense>
  );
}
