'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { EnvStatusCard } from './env-status-card';
import type { SetupStatus } from '@/lib/setup/env-checker';

interface EnvStatusDashboardProps {
  status: SetupStatus;
}

export function EnvStatusDashboard({ status }: EnvStatusDashboardProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the dashboard
    const dismissed = localStorage.getItem('env-dashboard-dismissed');
    if (dismissed === 'true' && status.isSetupComplete) {
      setIsDismissed(true);
    }
  }, [status.isSetupComplete]);

  const handleDismiss = () => {
    localStorage.setItem('env-dashboard-dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">
                Environment Setup
              </CardTitle>
              <CardDescription className="mt-1">
                {status.isSetupComplete
                  ? 'All required environment variables are configured'
                  : 'Some environment variables need to be configured'}
              </CardDescription>
            </div>
            {status.isSetupComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                title="Dismiss setup dashboard"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Required: {status.configuredRequired} of {status.totalRequired}
              </span>
              <span className="font-semibold">{status.progress}%</span>
            </div>
            <Progress value={status.progress} className="h-2" />
            {status.totalOptional > 0 && (
              <p className="text-xs text-muted-foreground">
                Optional: {status.configuredOptional} of {status.totalOptional} configured
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {status.categories.map((category) => (
            <EnvStatusCard key={category.category} category={category} />
          ))}
        </CardContent>

        {!status.isSetupComplete && (
          <CardContent className="pt-0">
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Click &ldquo;Show Details&rdquo; on any red card to see setup instructions</li>
                <li>Create a <code className="bg-background px-1 rounded">.env.local</code> file in the project root</li>
                <li>Add the missing environment variables</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
