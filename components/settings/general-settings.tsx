'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';
import { CheckCircle2, AlertCircle, Save, ShieldAlert } from 'lucide-react';
import { getSettings, updateSettings, type PortfolioSettings } from '@/lib/settings';

export function GeneralSettings() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [forceDevMode, setForceDevMode] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setMounted(true);
    // Check if dev mode is forced
    if (typeof window !== 'undefined' && (window as any).__CRITICAL_ENV_MISSING) {
      setForceDevMode(true);
    }
  }, []);

  if (!mounted || !settings) {
    return <div>Loading settings...</div>;
  }

  const handleSave = () => {
    if (!settings) return;
    
    setSaving(true);
    updateSettings(settings);
    
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Trigger page reload to apply mode change
      window.location.reload();
    }, 500);
  };

  const handleLogoUpload = (url: string) => {
    setSettings(prev => prev ? { ...prev, logo: url } : null);
  };

  const handleFaviconUpload = (url: string) => {
    setSettings(prev => prev ? { ...prev, favicon: url } : null);
  };

  return (
    <div className="space-y-6">
      {/* Critical Env Warning */}
      {forceDevMode && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            <strong>Development mode is auto-enforced.</strong> Critical environment variables are missing. 
            Configure required variables (Supabase, Admin Passphrase, Cloudinary) to enable published mode.
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Mode</CardTitle>
          <CardDescription>
            Control whether your portfolio is in development or published mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Development Mode</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, shows environment checker on home page
              </p>
            </div>
            <Switch
              checked={settings.mode === 'development'}
              onCheckedChange={(checked) => 
                setSettings(prev => prev ? { 
                  ...prev, 
                  mode: checked ? 'development' : 'published' 
                } : null)
              }
              disabled={forceDevMode}
            />
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {forceDevMode 
                ? 'Development mode is locked until critical environment variables are configured.'
                : settings.mode === 'development' 
                  ? 'Your portfolio is in development mode. The home page shows environment status.'
                  : 'Your portfolio is published. The home page shows your portfolio content.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* MCP Server */}
      <Card>
        <CardHeader>
          <CardTitle>MCP Server</CardTitle>
          <CardDescription>
            Enable or disable the Model Context Protocol API server for AI agents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable MCP Server</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, AI agents can access your portfolio data via MCP API
              </p>
            </div>
            <Switch
              checked={settings.mcpEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => prev ? { 
                  ...prev, 
                  mcpEnabled: checked 
                } : null)
              }
            />
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {settings.mcpEnabled 
                ? 'MCP server is enabled. API keys can be managed in the API Keys tab.'
                : 'MCP server is disabled. Enable it to allow AI agent access.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Website Name */}
      <Card>
        <CardHeader>
          <CardTitle>Website Name</CardTitle>
          <CardDescription>
            The name that appears in your portfolio header and footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="website-name">Website Name</Label>
            <Input
              id="website-name"
              value={settings.websiteName}
              onChange={(e) => 
                setSettings(prev => prev ? { 
                  ...prev, 
                  websiteName: e.target.value 
                } : null)
              }
              placeholder="My Portfolio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Website Logo</CardTitle>
          <CardDescription>
            Upload a logo for your portfolio website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={settings.logo || undefined}
            onChange={handleLogoUpload}
            folder="settings"
          />
          {settings.logo && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Current logo:</p>
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-16 w-auto object-contain border rounded p-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favicon Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Website Favicon</CardTitle>
          <CardDescription>
            Upload a favicon for your portfolio website (recommended: 32x32 or 64x64 pixels)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={settings.favicon || undefined}
            onChange={handleFaviconUpload}
            folder="settings"
          />
          {settings.favicon && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Current favicon:</p>
              <img 
                src={settings.favicon} 
                alt="Favicon" 
                className="h-8 w-8 object-contain border rounded"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Library */}
      <Card>
        <CardHeader>
          <CardTitle>Global Library</CardTitle>
          <CardDescription>
            Set a global library ID for your portfolio assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="global-library">Library ID</Label>
            <Input
              id="global-library"
              value={settings.globalLibrary || ''}
              onChange={(e) => 
                setSettings(prev => prev ? { 
                  ...prev, 
                  globalLibrary: e.target.value || null 
                } : null)
              }
              placeholder="Enter library ID (optional)"
            />
            <p className="text-sm text-muted-foreground">
              This ID will be used for organizing your portfolio assets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Settings saved!</span>
          </div>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
