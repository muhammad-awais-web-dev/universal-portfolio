'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertCircle, Plug, PlugZap, Unplug, Github } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { IntegrationPublic, GitHubConfig } from '@/lib/integrations/types';

type Status = 'connected' | 'disconnected' | 'error';

function StatusBadge({ status }: { status: Status }) {
  if (status === 'connected')
    return <Badge className="bg-green-500 hover:bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
  if (status === 'error')
    return <Badge className="bg-orange-500 hover:bg-orange-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
  return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Not Connected</Badge>;
}

// ─── Cloudinary Card ─────────────────────────────────────────────────────────
function CloudinaryCard({ integration, onRefresh }: { integration: IntegrationPublic | null; onRefresh: () => void }) {
  const [form, setForm] = useState({ cloud_name: '', api_key: '', api_secret: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status: Status = integration?.status ?? 'disconnected';

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/cloudinary/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Connection failed');
      onRefresh();
      setForm({ cloud_name: '', api_key: '', api_secret: '' });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/cloudinary', { method: 'DELETE' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRetest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/cloudinary/revalidate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) setError(data.details || data.error || 'Revalidation failed');
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/SVG%20Icons/cloudinary-svgrepo-com.svg" alt="Cloudinary" className="w-8 h-8 rounded object-contain" />
            <div>
              <CardTitle className="text-base">Cloudinary</CardTitle>
              <CardDescription className="text-xs">Image storage &amp; CDN</CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'error' && integration?.error_message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{integration.error_message}</AlertDescription>
          </Alert>
        )}

        {status === 'connected' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Cloud Name</p>
                <p className="font-mono text-xs">{integration?.masked.cloud_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">API Key</p>
                <p className="font-mono text-xs">{integration?.masked.api_key}</p>
              </div>
            </div>
            {integration?.connected_at && (
              <p className="text-xs text-muted-foreground">
                Connected {new Date(integration.connected_at).toLocaleString()}
              </p>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleRetest} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4 mr-1" />}
                Re-test
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDisconnect} disabled={loading}>
                <Unplug className="h-4 w-4 mr-1" />Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {status === 'error' && (
              <Button size="sm" variant="outline" onClick={handleRetest} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlugZap className="h-4 w-4 mr-2" />}
                Re-test existing credentials
              </Button>
            )}
            <div className="space-y-2">
              <Label className="text-xs">Cloud Name</Label>
              <Input placeholder="mycloud" value={form.cloud_name} onChange={(e) => setForm({ ...form, cloud_name: e.target.value })} className="h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">API Key</Label>
              <Input placeholder="123456789012345" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} className="h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">API Secret</Label>
              <Input type="password" placeholder="••••••••••••••••" value={form.api_secret} onChange={(e) => setForm({ ...form, api_secret: e.target.value })} className="h-8 text-sm" />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button size="sm" onClick={handleConnect} disabled={loading || !form.cloud_name || !form.api_key || !form.api_secret} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plug className="h-4 w-4 mr-2" />}
              Connect Cloudinary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Resend Card ──────────────────────────────────────────────────────────────
function ResendCard({ integration, onRefresh }: { integration: IntegrationPublic | null; onRefresh: () => void }) {
  const [form, setForm] = useState({ api_key: '', contact_email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status: Status = integration?.status ?? 'disconnected';

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/resend/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Connection failed');
      onRefresh();
      setForm({ api_key: '', contact_email: '' });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/resend', { method: 'DELETE' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRetest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/resend/revalidate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) setError(data.details || data.error || 'Revalidation failed');
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/SVG%20Icons/resend-icon-black.svg" alt="Resend" className="w-8 h-8 rounded object-contain dark:hidden" />
            <img src="/SVG%20Icons/resend-icon-white.svg" alt="Resend" className="w-8 h-8 rounded object-contain hidden dark:block" />
            <div>
              <CardTitle className="text-base">Resend</CardTitle>
              <CardDescription className="text-xs">Email delivery for contact form</CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'error' && integration?.error_message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{integration.error_message}</AlertDescription>
          </Alert>
        )}

        {status === 'connected' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">API Key</p>
                <p className="font-mono text-xs">{integration?.masked.api_key}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Email</p>
                <p className="font-mono text-xs">{integration?.masked.contact_email}</p>
              </div>
            </div>
            {integration?.connected_at && (
              <p className="text-xs text-muted-foreground">
                Connected {new Date(integration.connected_at).toLocaleString()}
              </p>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleRetest} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4 mr-1" />}
                Re-test
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDisconnect} disabled={loading}>
                <Unplug className="h-4 w-4 mr-1" />Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {status === 'error' && (
              <Button size="sm" variant="outline" onClick={handleRetest} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlugZap className="h-4 w-4 mr-2" />}
                Re-test existing credentials
              </Button>
            )}
            <div className="space-y-2">
              <Label className="text-xs">API Key</Label>
              <Input placeholder="re_..." value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} className="h-8 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Contact Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="h-8 text-sm" />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button size="sm" onClick={handleConnect} disabled={loading || !form.api_key || !form.contact_email} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plug className="h-4 w-4 mr-2" />}
              Connect Resend
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── GitHub Card ──────────────────────────────────────────────────────────────
function GitHubCard({ integration, onRefresh }: { integration: IntegrationPublic | null; onRefresh: () => void }) {
  const [form, setForm] = useState({ username: '', token: '', repo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingFeature, setTogglingFeature] = useState<string | null>(null);
  const status: Status = integration?.status ?? 'disconnected';

  const cfg = integration?.masked as unknown as Partial<GitHubConfig> | undefined;

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/github/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, show_commit_chart: true, show_top_languages: true, show_contribution_graph: true, show_pinned_repos: true, show_stats: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Connection failed');
      onRefresh();
      setForm({ username: '', token: '', repo: '' });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/github', { method: 'DELETE' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRetest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/integrations/github/revalidate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Revalidation failed');
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (feature: keyof Pick<GitHubConfig, 'show_commit_chart' | 'show_top_languages' | 'show_contribution_graph' | 'show_pinned_repos' | 'show_stats'>, value: boolean) => {
    setTogglingFeature(feature);
    try {
      await fetch('/api/integrations/github/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [feature]: value }),
      });
      onRefresh();
    } finally {
      setTogglingFeature(null);
    }
  };

  const features: { key: keyof Pick<GitHubConfig, 'show_commit_chart' | 'show_top_languages' | 'show_contribution_graph' | 'show_pinned_repos' | 'show_stats'>; label: string; desc: string }[] = [
    { key: 'show_commit_chart', label: 'Commit Activity Chart', desc: 'Weekly commit frequency bar chart' },
    { key: 'show_top_languages', label: 'Top Languages', desc: 'Most-used programming languages' },
    { key: 'show_contribution_graph', label: 'Contribution Graph', desc: 'GitHub-style heatmap calendar' },
    { key: 'show_pinned_repos', label: 'Pinned Repositories', desc: 'Showcase pinned GitHub repos' },
    { key: 'show_stats', label: 'GitHub Stats', desc: 'Stars, forks, followers overview' },
  ];

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github className="w-8 h-8" />
            <div>
              <CardTitle className="text-base">GitHub</CardTitle>
              <CardDescription className="text-xs">Show GitHub activity and stats on your portfolio</CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'connected' && cfg && (
          <>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium text-foreground">Username:</span> {cfg.username}</p>
              {cfg.repo && <p><span className="font-medium text-foreground">Repo:</span> {cfg.repo}</p>}
              {cfg.token && <p><span className="font-medium text-foreground">Token:</span> {cfg.token}</p>}
            </div>

            {/* Feature toggles */}
            <div className="border rounded-lg divide-y">
              {features.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={(cfg as unknown as GitHubConfig)[key] ?? true}
                    onCheckedChange={(v) => handleToggleFeature(key, v)}
                    disabled={togglingFeature === key}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={handleRetest} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlugZap className="h-4 w-4 mr-2" />}
                Re-test
              </Button>
              <Button size="sm" variant="outline" onClick={handleDisconnect} disabled={loading} className="text-destructive hover:text-destructive">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Unplug className="h-4 w-4 mr-2" />}
                Disconnect
              </Button>
            </div>
          </>
        )}

        {status === 'error' && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{integration?.error_message}</AlertDescription>
          </Alert>
        )}

        {(status === 'disconnected' || status === 'error') && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">GitHub Username *</Label>
              <Input placeholder="your-username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Personal Access Token <span className="text-muted-foreground">(optional — for private repos &amp; higher rate limits)</span></Label>
              <Input type="password" placeholder="ghp_xxxxxxxxxxxx" value={form.token} onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Default Repository <span className="text-muted-foreground">(optional)</span></Label>
              <Input placeholder="my-portfolio-repo" value={form.repo} onChange={(e) => setForm((f) => ({ ...f, repo: e.target.value }))} className="h-8 text-sm" />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button size="sm" onClick={handleConnect} disabled={loading || !form.username} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plug className="h-4 w-4 mr-2" />}
              Connect GitHub
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationPublic[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const get = (key: string) => integrations.find((i) => i.key === key) ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect third-party services. Credentials are stored securely in the database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CloudinaryCard integration={get('cloudinary')} onRefresh={load} />
        <ResendCard integration={get('resend')} onRefresh={load} />
        <GitHubCard integration={get('github')} onRefresh={load} />
      </div>
    </div>
  );
}
