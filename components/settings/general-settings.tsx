'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';
import { CheckCircle2, AlertCircle, Save, Trash2 } from 'lucide-react';
import { getSettings, updateSettings, type PortfolioSettings } from '@/lib/settings';


export function GeneralSettings() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setMounted(true);
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
    }, 500);
  };

  const handleLogoUpload = (url: string) => {
    setSettings(prev => prev ? { ...prev, logo: url } : null);
  };

  const handleFaviconUpload = (url: string) => {
    setSettings(prev => prev ? { ...prev, favicon: url } : null);
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    setCacheCleared(false);
    
    try {
      const response = await fetch('/api/cache/clear', {
        method: 'POST',
      });
      
      if (response.ok) {
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 3000);
      } else {
        console.error('Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setClearingCache(false);
    }
  };

  return (
    <div className="space-y-6">

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

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>
            Clear the portfolio data cache to force fresh data loading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <Label>Portfolio Data Cache</Label>
              <p className="text-sm text-muted-foreground">
                Portfolio data is cached for 3 days to improve performance. Clear the cache if you&apos;ve made changes and want to see them immediately.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              disabled={clearingCache}
              className="ml-4"
            >
              {clearingCache ? (
                'Clearing...'
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cache
                </>
              )}
            </Button>
          </div>
          
          {cacheCleared && (
            <Alert className="border-green-600 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Cache cleared successfully! Fresh data will be loaded on next page load.
              </AlertDescription>
            </Alert>
          )}
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
