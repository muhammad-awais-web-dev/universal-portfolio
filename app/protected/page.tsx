'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Cloud, Mail, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'checking' | 'ok' | 'error';

interface ServiceCard {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  check: () => Promise<{ ok: boolean; message: string }>;
}

const SERVICES: ServiceCard[] = [
  {
    id: 'supabase',
    label: 'Supabase',
    description: 'Database & authentication',
    icon: Database,
    check: async () => {
      try {
        const res = await fetch('/api/auth/session');
        return res.ok
          ? { ok: true, message: 'Connected successfully' }
          : { ok: false, message: `Responded with ${res.status}` };
      } catch (e) {
        return { ok: false, message: (e as Error).message };
      }
    },
  },
  {
    id: 'cloudinary',
    label: 'Cloudinary',
    description: 'Image storage & CDN',
    icon: Cloud,
    check: async () => {
      try {
        const res = await fetch('/api/cloudinary/list');
        if (res.ok) return { ok: true, message: 'Connected successfully' };
        const data = await res.json().catch(() => ({}));
        return { ok: false, message: data.error || `Responded with ${res.status}` };
      } catch (e) {
        return { ok: false, message: (e as Error).message };
      }
    },
  },
  {
    id: 'resend',
    label: 'Resend',
    description: 'Email delivery',
    icon: Mail,
    check: async () => {
      try {
        // HEAD request to /api/test-email — 200 = configured, 500 = misconfigured
        const res = await fetch('/api/test-email', { method: 'HEAD' });
        return res.ok
          ? { ok: true, message: 'Email configured' }
          : { ok: false, message: 'API key missing or invalid' };
      } catch (e) {
        return { ok: false, message: (e as Error).message };
      }
    },
  },
];

interface ServiceState {
  status: Status;
  message: string;
}

export default function DashboardPage() {
  const [states, setStates] = useState<Record<string, ServiceState>>(() =>
    Object.fromEntries(SERVICES.map((s) => [s.id, { status: 'idle' as Status, message: '' }]))
  );

  const checkService = useCallback(async (service: ServiceCard) => {
    setStates((prev) => ({ ...prev, [service.id]: { status: 'checking', message: '' } }));
    const result = await service.check();
    setStates((prev) => ({
      ...prev,
      [service.id]: { status: result.ok ? 'ok' : 'error', message: result.message },
    }));
  }, []);

  const checkAll = useCallback(() => {
    SERVICES.forEach((s) => checkService(s));
  }, [checkService]);

  // Auto-check on mount
  useEffect(() => { checkAll(); }, [checkAll]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Service connection status and system health</p>
        </div>
        <Button variant="outline" size="sm" onClick={checkAll} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Re-check all
        </Button>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SERVICES.map((service) => {
          const state = states[service.id];
          const Icon = service.icon;

          return (
            <Card key={service.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">{service.label}</CardTitle>
                </div>
                <StatusBadge status={state.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{service.description}</p>
                {state.message && (
                  <p className={`text-xs ${state.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {state.message}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => checkService(service)}
                  disabled={state.status === 'checking'}
                  className="h-7 text-xs px-2 w-full"
                >
                  {state.status === 'checking' ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Checking…</>
                  ) : (
                    <><RefreshCw className="h-3 w-3 mr-1" /> Test connection</>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === 'idle') return <Badge variant="secondary" className="text-xs">Not tested</Badge>;
  if (status === 'checking') return <Badge variant="secondary" className="text-xs gap-1"><Loader2 className="h-2.5 w-2.5 animate-spin" />Checking</Badge>;
  if (status === 'ok') return <Badge className="text-xs gap-1 bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/15"><CheckCircle2 className="h-2.5 w-2.5" />Connected</Badge>;
  return <Badge variant="destructive" className="text-xs gap-1"><XCircle className="h-2.5 w-2.5" />Error</Badge>;
}

