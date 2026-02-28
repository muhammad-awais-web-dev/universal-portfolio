'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database, Cloud, Mail, RefreshCw, CheckCircle2, XCircle, Loader2,
  AlertCircle, Settings2, FolderKanban, Briefcase, GraduationCap,
  Award, MessageSquare, Wrench, ImageIcon, Plug, Github,
  Star, BookOpen, AlertTriangle, Plus, ArrowRight,
} from 'lucide-react';
import type { IntegrationPublic } from '@/lib/integrations/types';
import type { GitHubStats } from '@/app/api/github/route';

type DbStatus = 'idle' | 'checking' | 'ok' | 'error';

// ─── Badges ───────────────────────────────────────────────────────────────────
function LiveBadge({ status }: { status: DbStatus }) {
  if (status === 'idle') return <Badge variant="secondary" className="text-xs">Not tested</Badge>;
  if (status === 'checking') return <Badge variant="secondary" className="text-xs gap-1"><Loader2 className="h-2.5 w-2.5 animate-spin" />Checking</Badge>;
  if (status === 'ok') return <Badge className="text-xs gap-1 bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/15"><CheckCircle2 className="h-2.5 w-2.5" />Connected</Badge>;
  return <Badge variant="destructive" className="text-xs gap-1"><XCircle className="h-2.5 w-2.5" />Error</Badge>;
}

function StoredBadge({ status }: { status: string }) {
  if (status === 'connected') return <Badge className="text-xs gap-1 bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/15"><CheckCircle2 className="h-2.5 w-2.5" />Connected</Badge>;
  if (status === 'error') return <Badge className="text-xs gap-1 bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/15"><AlertCircle className="h-2.5 w-2.5" />Error</Badge>;
  return <Badge variant="secondary" className="text-xs gap-1"><XCircle className="h-2.5 w-2.5" />Not connected</Badge>;
}

// ─── Supabase live check ──────────────────────────────────────────────────────
function SupabaseCard() {
  const [status, setStatus] = useState<DbStatus>('idle');
  const [message, setMessage] = useState('');

  const check = useCallback(async () => {
    setStatus('checking');
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) { setStatus('ok'); setMessage('Connected successfully'); }
      else { setStatus('error'); setMessage(`Responded with ${res.status}`); }
    } catch (e) {
      setStatus('error'); setMessage((e as Error).message);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted"><Database className="h-4 w-4" /></div>
          <CardTitle className="text-sm font-semibold">Supabase</CardTitle>
        </div>
        <LiveBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">Database &amp; authentication</p>
        {message && <p className={`text-xs ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{message}</p>}
        <Button variant="ghost" size="sm" onClick={check} disabled={status === 'checking'} className="h-7 text-xs px-2 w-full">
          {status === 'checking' ? <><Loader2 className="h-3 w-3 animate-spin mr-1" />Checking…</> : <><RefreshCw className="h-3 w-3 mr-1" />Test connection</>}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Integration status card ──────────────────────────────────────────────────
function IntegrationCard({
  label, description, icon: Icon, integration, retestUrl,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  integration: IntegrationPublic | null | undefined;
  retestUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<IntegrationPublic | null | undefined>(integration);

  useEffect(() => { setLocalStatus(integration); }, [integration]);

  const retest = async () => {
    setLoading(true);
    try {
      const res = await fetch(retestUrl, { method: 'POST' });
      const data = await res.json();
      setLocalStatus((prev) => prev ? { ...prev, status: data.status ?? (res.ok ? 'connected' : 'error'), error_message: data.details ?? null } : prev);
    } finally {
      setLoading(false);
    }
  };

  const stored = localStatus?.status ?? 'disconnected';
  const connectedAt = localStatus?.connected_at ? new Date(localStatus.connected_at) : null;
  const daysAgo = connectedAt ? Math.floor((Date.now() - connectedAt.getTime()) / 86400000) : null;

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted"><Icon className="h-4 w-4" /></div>
          <CardTitle className="text-sm font-semibold">{label}</CardTitle>
        </div>
        <StoredBadge status={stored} />
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{description}</p>
        {daysAgo !== null && stored === 'connected' && (
          <p className="text-xs text-muted-foreground">Connected {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}</p>
        )}
        {stored === 'error' && localStatus?.error_message && (
          <p className="text-xs text-destructive line-clamp-2">{localStatus.error_message}</p>
        )}
        {stored === 'disconnected' && (
          <p className="text-xs text-muted-foreground">
            Not configured — <Link href="/protected/integrations" className="underline">set up in Integrations</Link>
          </p>
        )}
        {stored === 'error' && (
          <Button variant="ghost" size="sm" onClick={retest} disabled={loading} className="h-7 text-xs px-2 w-full">
            {loading ? <><Loader2 className="h-3 w-3 animate-spin mr-1" />Retesting…</> : <><RefreshCw className="h-3 w-3 mr-1" />Re-test</>}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── GitHub quick card ────────────────────────────────────────────────────────
function GitHubCard({ integration }: { integration: IntegrationPublic | null | undefined }) {
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    if (integration?.status === 'connected') {
      fetch('/api/github').then(r => r.ok ? r.json() : null).then(setGhStats).catch(() => {});
    }
  }, [integration]);

  const stored = integration?.status ?? 'disconnected';

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted"><Github className="h-4 w-4" /></div>
          <CardTitle className="text-sm font-semibold">GitHub</CardTitle>
        </div>
        <StoredBadge status={stored} />
      </CardHeader>
      <CardContent className="space-y-2">
        {stored === 'connected' && ghStats ? (
          <>
            <p className="text-xs text-muted-foreground">@{ghStats.username}</p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{ghStats.total_repos} repos</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{ghStats.total_stars} stars</span>
            </div>
          </>
        ) : stored === 'connected' ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          <p className="text-xs text-muted-foreground">Not configured — <Link href="/protected/integrations" className="underline">set up in Integrations</Link></p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface PortfolioStats {
  projects: number;
  skills: number;
  skillCategories: number;
  certifications: number;
  education: number;
  experiences: number;
  testimonials: number;
}

interface Migration { name: string; applied: boolean; }

export default function DashboardPage() {
  const [integrations, setIntegrations] = useState<IntegrationPublic[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [pendingMigrations, setPendingMigrations] = useState<Migration[]>([]);

  useEffect(() => {
    // Integrations
    fetch('/api/integrations')
      .then((r) => r.json())
      .then((d) => setIntegrations(d.integrations ?? []))
      .finally(() => setLoadingIntegrations(false));

    // Portfolio stats
    fetch('/api/portfolio')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) setPortfolioStats({
          projects: d.projects?.length ?? 0,
          skills: d.skills?.length ?? 0,
          skillCategories: d.skillCategories?.length ?? 0,
          certifications: d.certifications?.length ?? 0,
          education: d.education?.length ?? 0,
          experiences: d.experiences?.length ?? 0,
          testimonials: d.testimonials?.length ?? 0,
        });
      })
      .catch(() => {});

    // Pending migrations
    fetch('/api/admin/migrate')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.migrations) setPendingMigrations(d.migrations.filter((m: Migration) => !m.applied));
      })
      .catch(() => {});
  }, []);

  const get = (key: string) => integrations.find((i) => i.key === key);

  const statItems = portfolioStats ? [
    { icon: FolderKanban, label: 'Projects', value: portfolioStats.projects, href: '/protected/projects' },
    { icon: Wrench, label: 'Skills', value: portfolioStats.skills, href: '/protected/skills' },
    { icon: Briefcase, label: 'Experience', value: portfolioStats.experiences, href: '/protected/experience' },
    { icon: GraduationCap, label: 'Education', value: portfolioStats.education, href: '/protected/education' },
    { icon: Award, label: 'Certifications', value: portfolioStats.certifications, href: '/protected/certifications' },
    { icon: MessageSquare, label: 'Testimonials', value: portfolioStats.testimonials, href: '/protected/testimonials' },
  ] : [];

  const quickLinks = [
    { icon: Plus, label: 'New Project', href: '/protected/projects/new', color: 'text-blue-500' },
    { icon: ImageIcon, label: 'Media Library', href: '/protected/media-library', color: 'text-purple-500' },
    { icon: Plug, label: 'Integrations', href: '/protected/integrations', color: 'text-green-500' },
    { icon: Settings2, label: 'Settings', href: '/protected/settings', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">System health, portfolio stats and quick actions</p>
      </div>

      {/* Pending migrations warning */}
      {pendingMigrations.length > 0 && (
        <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950/30">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-700 dark:text-orange-400">
              <strong>{pendingMigrations.length}</strong> pending database migration{pendingMigrations.length > 1 ? 's' : ''}: {pendingMigrations.map(m => m.name).join(', ')}
            </span>
            <Link href="/protected/settings?tab=database">
              <button className="ml-4 text-sm font-medium text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:no-underline whitespace-nowrap">
                Run migrations →
              </button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Service connections */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SupabaseCard />
          {loadingIntegrations ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><CardContent className="flex items-center justify-center h-24"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardContent></Card>
            ))
          ) : (
            <>
              <IntegrationCard label="Cloudinary" description="Image storage & CDN" icon={Cloud} integration={get('cloudinary')} retestUrl="/api/integrations/cloudinary/revalidate" />
              <IntegrationCard label="Resend" description="Email delivery" icon={Mail} integration={get('resend')} retestUrl="/api/integrations/resend/revalidate" />
              <GitHubCard integration={get('github')} />
            </>
          )}
        </div>
      </div>

      {/* Portfolio stats */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Portfolio Content</h3>
        {portfolioStats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statItems.map(({ icon: Icon, label, value, href }) => (
              <Link key={label} href={href}>
                <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Icon className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4 flex items-center justify-center h-20"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent></Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ icon: Icon, label, href, color }) => (
            <Link key={label} href={href}>
              <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

