'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertCircle, Plug, PlugZap, Unplug } from 'lucide-react';
import type { IntegrationPublic } from '@/lib/integrations/types';

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
          Env variables are used as fallback if no database credential is set.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CloudinaryCard integration={get('cloudinary')} onRefresh={load} />
        <ResendCard integration={get('resend')} onRefresh={load} />
      </div>
    </div>
  );
}
