'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, Copy, Check, Play, AlertTriangle, RefreshCw } from 'lucide-react';

interface MigrationStatus {
  name: string;
  applied: boolean;
  appliedAt?: string;
}

interface StatusResponse {
  bootstrapReady: boolean;
  migrations: MigrationStatus[];
  bootstrapSQL: string;
}

interface RunResult {
  applied: string[];
  skipped: string[];
  errors: { name: string; error: string }[];
  needsBootstrap?: boolean;
}

export function DatabaseMigrationsSettings() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/migrate');
      if (!res.ok) throw new Error('Failed to fetch status');
      setStatus(await res.json());
    } catch {
      // ignore — shows empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' });
      const data: RunResult = await res.json();
      setRunResult(data);
      if (data.applied.length > 0 && data.errors.length === 0) {
        await fetchStatus();
      }
    } catch (err) {
      setRunResult({
        applied: [],
        skipped: [],
        errors: [{ name: 'network', error: err instanceof Error ? err.message : String(err) }],
      });
    } finally {
      setRunning(false);
    }
  };

  const copyBootstrap = () => {
    if (status?.bootstrapSQL) {
      navigator.clipboard.writeText(status.bootstrapSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pendingCount = status?.migrations.filter((m) => !m.applied).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Database Migrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Apply database schema updates directly from this page.
        </p>
      </div>

      {/* Bootstrap notice */}
      {status && !status.bootstrapReady && (
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              One-Time Setup Required
            </CardTitle>
            <CardDescription>
              Run this SQL once in your{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Supabase SQL Editor
              </a>{' '}
              to enable in-app migrations. After this, all future migrations run automatically here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="bg-muted rounded-md p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
              {status.bootstrapSQL}
            </pre>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyBootstrap}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy SQL'}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchStatus}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration status */}
      {status?.bootstrapReady && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Migration Status
                  {pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {pendingCount} pending
                    </Badge>
                  )}
                  {pendingCount === 0 && (
                    <Badge variant="outline" className="ml-2 text-xs text-green-600 border-green-600">
                      Up to date
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {status.migrations.length} total migrations •{' '}
                  {status.migrations.filter((m) => m.applied).length} applied
                </CardDescription>
              </div>
              <Button
                onClick={handleRun}
                disabled={running || pendingCount === 0}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                {running ? 'Running...' : 'Run Pending'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                status.migrations.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {m.applied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                      <span className="font-mono text-sm">{m.name}</span>
                    </div>
                    {m.applied ? (
                      <span className="text-xs text-muted-foreground">
                        {m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : 'Applied'}
                      </span>
                    ) : (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-400">
                        Pending
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Run result feedback */}
      {runResult && (
        <Alert variant={runResult.errors.length > 0 ? 'destructive' : 'default'}>
          <AlertDescription className="space-y-1">
            {runResult.needsBootstrap && (
              <p>⚠️ Bootstrap SQL has not been run yet. See instructions above.</p>
            )}
            {runResult.applied.length > 0 && (
              <p>✅ Applied: {runResult.applied.join(', ')}</p>
            )}
            {runResult.skipped.length > 0 && (
              <p>⏭ Skipped (already applied): {runResult.skipped.join(', ')}</p>
            )}
            {runResult.errors.map((e) => (
              <p key={e.name}>❌ {e.name}: {e.error}</p>
            ))}
            {runResult.applied.length === 0 && runResult.errors.length === 0 && (
              <p>✅ All migrations are already up to date.</p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
