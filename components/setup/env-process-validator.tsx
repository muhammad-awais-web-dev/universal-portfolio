'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface SubStep {
  id: string;
  label: string;
  status: 'pending' | 'checking' | 'success' | 'error';
  message?: string;
}

interface ValidationService {
  id: string;
  label: string;
  status: 'pending' | 'checking' | 'success' | 'error';
  isOpen: boolean;
  subSteps: SubStep[];
  message?: string;
  errorMessage?: string;
  fixInstructions?: string;
}

interface EnvProcessValidatorProps {
  missingVars: string[];
  forceDevMode: boolean;
}

// Get stored validation from localStorage
function getStoredValidation() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('env-validation-cache');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Save validation to localStorage
function saveValidation(hash: string, results: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('env-validation-cache', JSON.stringify({
    hash,
    results,
    timestamp: Date.now(),
  }));
}

export function EnvProcessValidator({ missingVars, forceDevMode }: EnvProcessValidatorProps) {
  const [services, setServices] = useState<ValidationService[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'validating' | 'complete' | 'error'>('idle');
  const [useCache, setUseCache] = useState(false);

  useEffect(() => {
    checkCacheAndValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkCacheAndValidate() {
    try {
      // Get current env var values (we'll fetch them from the server)
      const response = await fetch('/api/setup/env-hash');
      const { hash } = await response.json();
      
      const stored = getStoredValidation();
      
      // Check if cache is valid
      if (stored && stored.hash === hash) {
        // Cache is valid, use stored results
        setUseCache(true);
        displayCachedResults(stored.results);
        setOverallStatus('complete');
      } else {
        // Cache invalid or missing, validate
        await validateEnv(hash);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setOverallStatus('error');
    }
  }

  function displayCachedResults(results: Record<string, boolean>) {
    const cachedServices: ValidationService[] = [
      {
        id: 'supabase',
        label: 'Supabase',
        status: results.supabaseConnection ? 'success' : 'error',
        isOpen: false,
        subSteps: [],
        message: results.supabaseConnection ? 'Connected (cached)' : 'Connection failed',
      },
      {
        id: 'admin-passphrase',
        label: 'Admin Passphrase',
        status: results.adminPassphrase ? 'success' : 'error',
        isOpen: false,
        subSteps: [],
        message: results.adminPassphrase ? 'Configured (cached)' : 'Not configured',
      },
    ];

    // Add Cloudinary if configured
    if (results.cloudinaryUrl !== undefined && results.cloudinaryUrl) {
      cachedServices.push({
        id: 'cloudinary',
        label: 'Cloudinary',
        status: results.cloudinaryConnection ? 'success' : 'error',
        isOpen: false,
        subSteps: [],
        message: results.cloudinaryConnection ? 'Connected (cached)' : 'Not configured',
      });
    }

    setServices(cachedServices);
  }

  async function validateEnv(hash: string) {
    setIsValidating(true);
    setOverallStatus('validating');
    setUseCache(false);

    const results: Record<string, boolean> = {};

    // Initialize services (Cloudinary added only if connected via integrations)
    const initialServices: ValidationService[] = [
      {
        id: 'supabase',
        label: 'Supabase',
        status: 'pending',
        isOpen: false,
        subSteps: [],
      },
      {
        id: 'admin-passphrase',
        label: 'Admin Passphrase',
        status: 'pending',
        isOpen: false,
        subSteps: [],
      },
    ];

    setServices(initialServices);
    await sleep(300);

    // Validate Supabase
    await validateSupabase(results);
    await sleep(500);

    // Validate Admin Passphrase
    await validateAdminPassphrase(results);
    await sleep(500);

    // Validate Cloudinary (optional)
    await validateCloudinary(results);

    // Save validation results
    saveValidation(hash, results);
    setIsValidating(false);
    setOverallStatus('complete');
  }

  async function validateSupabase(results: Record<string, boolean>) {
    // Open Supabase dropdown and set to checking
    setServices(prev => prev.map(s => 
      s.id === 'supabase' ? { ...s, status: 'checking', isOpen: true } : s
    ));
    await sleep(300);

    // Single step: Validate Supabase Connection
    setServices(prev => prev.map(s => 
      s.id === 'supabase' ? {
        ...s,
        subSteps: [{ id: 'connection', label: 'Validating Supabase connection', status: 'checking' }]
      } : s
    ));
    await sleep(800);

    // Check which env vars are missing
    const missingVars: string[] = [];
    const urlCheck = await fetch('/api/setup/check-env?var=SUPABASE_URL');
    const urlData = await urlCheck.json();
    if (!urlData.configured) missingVars.push('SUPABASE_URL');

    const keyCheck = await fetch('/api/setup/check-env?var=SUPABASE_SERVICE_ROLE_KEY');
    const keyData = await keyCheck.json();
    if (!keyData.configured) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');

    results.supabaseUrl = urlData.configured;
    results.supabaseKey = keyData.configured;

    // If vars are missing, show error
    if (missingVars.length > 0) {
      results.supabaseConnection = false;
      setServices(prev => prev.map(s => 
        s.id === 'supabase' ? {
          ...s,
          subSteps: s.subSteps.map(sub => ({
            ...sub,
            label: 'Supabase Connection',
            status: 'error',
            message: 'Configuration incomplete'
          })),
          status: 'error',
          isOpen: true,
          errorMessage: `Missing environment variables: ${missingVars.join(', ')}`,
          fixInstructions: 'Go to Supabase Dashboard → Project Settings → API. Copy your Project URL and Service Role Key, then add them to your .env.local file:\n\nSUPABASE_URL=your-project-url\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key',
        } : s
      ));
      return;
    }

    // Try to validate the connection
    try {
      const connectionCheck = await fetch('/api/setup/validate-supabase');
      const connectionData = await connectionCheck.json();
      results.supabaseConnection = connectionData.valid;

      if (connectionData.valid) {
        // Success - close dropdown
        setServices(prev => prev.map(s => 
          s.id === 'supabase' ? {
            ...s,
            subSteps: s.subSteps.map(sub => ({
              ...sub,
              label: 'Supabase Connection',
              status: 'success',
              message: 'Connected successfully'
            })),
            status: 'success',
            isOpen: false,
          } : s
        ));
      } else {
        // Connection failed
        setServices(prev => prev.map(s => 
          s.id === 'supabase' ? {
            ...s,
            subSteps: s.subSteps.map(sub => ({
              ...sub,
              label: 'Supabase Connection',
              status: 'error',
              message: 'Connection failed'
            })),
            status: 'error',
            isOpen: true,
            errorMessage: 'Unable to connect to Supabase',
            fixInstructions: 'Please verify your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct. Check your Supabase project dashboard to ensure the credentials match.',
          } : s
        ));
      }
    } catch {
      results.supabaseConnection = false;
      setServices(prev => prev.map(s => 
        s.id === 'supabase' ? {
          ...s,
          subSteps: s.subSteps.map(sub => ({
            ...sub,
            label: 'Supabase Connection',
            status: 'error',
            message: 'Connection error'
          })),
          status: 'error',
          isOpen: true,
          errorMessage: 'Connection error occurred',
          fixInstructions: 'Failed to connect to Supabase. Check your internet connection and verify your credentials.',
        } : s
      ));
    }
  }

  async function validateAdminPassphrase(results: Record<string, boolean>) {
    // Open Admin Passphrase and set to checking
    setServices(prev => prev.map(s => 
      s.id === 'admin-passphrase' ? { ...s, status: 'checking', isOpen: true } : s
    ));
    await sleep(300);

    setServices(prev => prev.map(s => 
      s.id === 'admin-passphrase' ? {
        ...s,
        subSteps: [{ id: 'check', label: 'Checking admin passphrase', status: 'checking' }]
      } : s
    ));
    await sleep(800);

    const passphraseCheck = await fetch('/api/setup/check-env?var=ADMIN_PASSPHRASE');
    const passphraseData = await passphraseCheck.json();
    results.adminPassphrase = passphraseData.configured;

    if (passphraseData.configured) {
      // Success - close dropdown
      setServices(prev => prev.map(s => 
        s.id === 'admin-passphrase' ? {
          ...s,
          subSteps: s.subSteps.map(sub => ({
            ...sub,
            label: 'Admin Passphrase',
            status: 'success',
            message: 'Configured'
          })),
          status: 'success',
          isOpen: false,
        } : s
      ));
    } else {
      // Not configured
      setServices(prev => prev.map(s => 
        s.id === 'admin-passphrase' ? {
          ...s,
          subSteps: s.subSteps.map(sub => ({
            ...sub,
            label: 'Admin Passphrase',
            status: 'error',
            message: 'Not configured'
          })),
          status: 'error',
          isOpen: true,
          errorMessage: 'Missing environment variable: ADMIN_PASSPHRASE',
          fixInstructions: 'Generate a secure 125+ character passphrase:\n\n1. Run this command:\n   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'base64\'))"\n\n2. Add to .env.local:\n   ADMIN_PASSPHRASE=your-generated-passphrase',
        } : s
      ));
    }
  }

  async function validateCloudinary(results: Record<string, boolean>) {
    // Cloudinary is managed via Supabase integrations — check the integration status
    try {
      const integrationCheck = await fetch('/api/integrations/cloudinary');
      if (!integrationCheck.ok) {
        results.cloudinaryUrl = false;
        results.cloudinaryConnection = false;
        return;
      }

      const integrationData = await integrationCheck.json();
      const isConnected = integrationData.status === 'connected';

      if (!isConnected) {
        results.cloudinaryUrl = false;
        results.cloudinaryConnection = false;
        return;
      }

      // Connected via integrations — add and show success
      setServices(prev => [
        ...prev,
        {
          id: 'cloudinary',
          label: 'Cloudinary',
          status: 'success' as const,
          isOpen: false,
          subSteps: [],
          message: 'Connected via Integrations',
        },
      ]);
      results.cloudinaryUrl = true;
      results.cloudinaryConnection = true;
    } catch {
      results.cloudinaryUrl = false;
      results.cloudinaryConnection = false;
    }
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function handleRevalidate() {
    // Clear cache
    if (typeof window !== 'undefined') {
      localStorage.removeItem('env-validation-cache');
    }
    
    // Revalidate
    await checkCacheAndValidate();
  }

  function toggleService(serviceId: string) {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, isOpen: !s.isOpen } : s
    ));
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">
              Environment Validation
            </CardTitle>
            <CardDescription className="mt-1">
              {overallStatus === 'idle' && 'Checking environment configuration...'}
              {overallStatus === 'validating' && 'Validating environment variables...'}
              {overallStatus === 'complete' && (useCache ? 'Using cached validation results' : 'Validation complete')}
              {overallStatus === 'error' && 'Validation error occurred'}
            </CardDescription>
          </div>
          {overallStatus === 'complete' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevalidate}
              disabled={isValidating}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isValidating && "animate-spin")} />
              Revalidate
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {forceDevMode && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
            <p className="font-semibold">⚠️ Critical environment variables missing</p>
            <p className="mt-1">Missing: {missingVars.join(', ')}</p>
          </div>
        )}

        {services.map((service) => (
          <ServiceItem 
            key={service.id} 
            service={service} 
            onToggle={toggleService}
          />
        ))}

        {overallStatus === 'idle' && services.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServiceItem({ service, onToggle }: { service: ValidationService; onToggle: (id: string) => void }) {
  const hasSubSteps = service.subSteps.length > 0;
  const canToggle = hasSubSteps || service.status === 'error';

  return (
    <div className="border rounded-lg">
      <Collapsible open={service.isOpen} onOpenChange={() => canToggle && onToggle(service.id)}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1">
            {service.status === 'pending' && (
              <div className="h-5 w-5 flex-shrink-0" />
            )}
            {service.status === 'checking' && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 flex-shrink-0" />
            )}
            {service.status === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            )}
            {service.status === 'error' && (
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-medium">{service.label}</p>
              {service.status === 'success' && !service.isOpen && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Connected
                </p>
              )}
            </div>
          </div>
          {canToggle && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {service.isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-2 border-t">
            {service.subSteps.map((subStep) => (
              <div key={subStep.id} className="flex items-center gap-3 py-2 pl-8">
                {subStep.status === 'pending' && (
                  <div className="h-4 w-4 flex-shrink-0" />
                )}
                {subStep.status === 'checking' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                )}
                {subStep.status === 'success' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                {subStep.status === 'error' && (
                  <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm">{subStep.label}</p>
                  {subStep.message && (
                    <p className={cn(
                      "text-xs",
                      subStep.status === 'success' && "text-green-600 dark:text-green-400",
                      subStep.status === 'error' && "text-destructive",
                      subStep.status === 'checking' && "text-muted-foreground"
                    )}>
                      {subStep.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {service.errorMessage && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{service.errorMessage}</p>
                    {service.fixInstructions && (
                      <p className="text-xs text-muted-foreground mt-1">{service.fixInstructions}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

