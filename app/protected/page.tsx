'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Cloud, Mail, RefreshCw, CheckCircle2, XCircle, Loader2, AlertCircle, Settings2 } from 'lucide-react';
import type { IntegrationPublic } from '@/lib/integrations/types';

type DbStatus = 'idle' | 'checking' | 'ok' | 'error';

// ─── Supabase live check (not an integration — stays as live check) ──────────
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

// ─── Integration status card (reads stored status, Re-test on error) ─────────
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

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-muted"><Icon className="h-4 w-4" /></div>
          <CardTitle className="text-sm font-semibold">{label}</CardTitle>
        </div>
        <StoredBadge status={stored} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{description}</p>
        {stored === 'error' && localStatus?.error_message && (
          <p className="text-xs text-destructive">{localStatus.error_message}</p>
        )}
        {stored === 'disconnected' && (
          <p className="text-xs text-muted-foreground">Not configured — <Link href="/protected/integrations" className="underline">set up in Integrations</Link></p>
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

