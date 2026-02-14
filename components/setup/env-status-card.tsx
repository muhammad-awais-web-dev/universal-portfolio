'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import type { CategoryStatus } from '@/lib/setup/env-checker';

interface EnvStatusCardProps {
  category: CategoryStatus;
}

export function EnvStatusCard({ category }: EnvStatusCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    complete: 'bg-green-500/10 text-green-600 border-green-500/20',
    partial: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    missing: 'bg-red-500/10 text-red-600 border-red-500/20',
    optional: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  const StatusIcon = {
    complete: CheckCircle2,
    partial: AlertCircle,
    missing: XCircle,
    optional: AlertCircle,
  }[category.status];

  return (
    <Card className={`${statusColors[category.status]} border-2 w-full`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription className="text-xs">{category.description}</CardDescription>
            </div>
          </div>
          <StatusIcon className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline" className="text-xs">
            {category.configured}/{category.total} Configured
          </Badge>
          {category.required > 0 && (
            <Badge variant="secondary" className="text-xs">
              {category.required} Required
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {category.variables.length > 0 && (
        <>
          <CardContent>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show Details <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>

          {isExpanded && (
            <CardContent className="pt-0 space-y-3">
              {category.variables.map((envVar) => (
                <div
                  key={envVar.key}
                  className="border rounded-lg p-3 bg-background/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {envVar.key}
                        </code>
                        {envVar.configured ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {envVar.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {envVar.description}
                      </p>
                      {!envVar.configured && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <p className="font-semibold mb-1">Setup Instructions:</p>
                          <p className="text-muted-foreground">{envVar.instructions}</p>
                          {envVar.setupUrl && (
                            <a
                              href={envVar.setupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-primary hover:underline"
                            >
                              Open Dashboard <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}
