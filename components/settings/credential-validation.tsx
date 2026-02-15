'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { validateAllCredentials, type CredentialValidation } from '@/lib/validation/credentials';
import { Badge } from '@/components/ui/badge';

export function CredentialValidationSection() {
  const [validation, setValidation] = useState<CredentialValidation>({
    supabase: { isValid: false, message: 'Not tested' },
    cloudinary: { isValid: false, message: 'Not tested' },
    loading: false,
  });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Auto-validate on mount for admins
    runValidation();
  }, []);

  const runValidation = async () => {
    setTesting(true);
    const result = await validateAllCredentials();
    setValidation(result);
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credential Validation</CardTitle>
          <CardDescription>
            Test your Supabase and Cloudinary connections to ensure everything is configured correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              These tests make actual API calls to validate your credentials. 
              This helps ensure your portfolio is properly configured.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={runValidation} 
            disabled={testing}
            variant="outline"
            className="w-full"
          >
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing Connections...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Credentials
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Supabase Validation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supabase Connection</CardTitle>
            <Badge variant={validation.supabase.isValid ? 'default' : 'destructive'}>
              {validation.supabase.isValid ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            {validation.supabase.isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{validation.supabase.message}</p>
              {validation.supabase.details && (
                <p className="text-sm text-muted-foreground mt-1">
                  {validation.supabase.details}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloudinary Validation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cloudinary Connection</CardTitle>
            <Badge variant={validation.cloudinary.isValid ? 'default' : 'destructive'}>
              {validation.cloudinary.isValid ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            {validation.cloudinary.isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{validation.cloudinary.message}</p>
              {validation.cloudinary.details && (
                <p className="text-sm text-muted-foreground mt-1">
                  {validation.cloudinary.details}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Status */}
      {validation.supabase.isValid && validation.cloudinary.isValid && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            All credentials are valid! Your portfolio is properly configured.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
