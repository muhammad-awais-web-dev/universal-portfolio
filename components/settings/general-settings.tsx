'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { LogoDisplay } from '@/components/portfolio/logo-display';
import { invalidatePublicSettingsCache } from '@/lib/hooks/usePublicSettings';
import {
  CheckCircle2, AlertCircle, Save, Trash2, RefreshCw,
  AlignCenter, AlignLeft, Image as ImageIcon, Type
} from 'lucide-react';
import type { SiteSettings, LogoSettings, LogoStyle, LogoLayout, LogoSize } from '@/lib/settings/types';

export function GeneralSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setError('Failed to load settings'));
  }, []);

  if (!settings) {
    return <div className="text-muted-foreground text-sm py-4">Loading settings...</div>;
  }

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((prev) => prev ? { ...prev, [key]: value } : null);

  const setLogo = (partial: Partial<LogoSettings>) =>
    setSettings((prev) => prev ? { ...prev, logo: { ...prev.logo, ...partial } } : null);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.details || data?.error || 'Save failed');
      setSettings(data);
      invalidatePublicSettingsCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      await fetch('/api/cache/clear', { method: 'POST' });
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    } finally {
      setClearingCache(false);
    }
  };

  const logo = settings.logo;

  return (
    <div className="space-y-6">

      {/* Dev Mode */}
      <Card className={settings.dev_mode ? 'border-amber-500/60' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Development Mode
            {settings.dev_mode && <Badge variant="destructive" className="text-xs">Active</Badge>}
          </CardTitle>
          <CardDescription>
            When enabled, visitors see a Coming Soon page. You (as admin) still see the full site with a banner.
            Takes effect immediately — no cache involved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Enable Dev Mode</Label>
            <Switch checked={settings.dev_mode} onCheckedChange={(v) => set('dev_mode', v)} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>Show or hide the contact form on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Contact Form</Label>
              <p className="text-sm text-muted-foreground">Requires Resend email to be configured</p>
            </div>
            <Switch checked={settings.contact_form_enabled} onCheckedChange={(v) => set('contact_form_enabled', v)} />
          </div>
        </CardContent>
      </Card>

      {/* MCP */}
      <Card>
        <CardHeader>
          <CardTitle>MCP Server</CardTitle>
          <CardDescription>Enable or disable the AI agent API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable MCP Server</Label>
              <p className="text-sm text-muted-foreground">Allows AI agents to access portfolio data via API</p>
            </div>
            <Switch checked={settings.mcp_enabled} onCheckedChange={(v) => set('mcp_enabled', v)} />
          </div>
          {settings.mcp_enabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>MCP API is active. Manage API keys in the API Keys tab.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Website Name */}
      <Card>
        <CardHeader>
          <CardTitle>Website Name</CardTitle>
          <CardDescription>Shown in the navbar and browser tab when no custom logo text is set</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="website-name">Name</Label>
            <Input
              id="website-name"
              value={settings.website_name}
              onChange={(e) => set('website_name', e.target.value)}
              placeholder="My Portfolio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Customize how your brand appears in the navbar. The image is optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Live preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Preview</p>
            <LogoDisplay logo={logo} fallbackText={settings.website_name || 'My Portfolio'} />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>Logo Image <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
            <ImageUpload
              value={logo.url || undefined}
              onChange={(url) => setLogo({ url })}
              onDelete={() => setLogo({ url: null })}
              folder="settings"
            />
          </div>

          {/* Shape — only when image is set */}
          {logo.url && (
            <div className="space-y-2">
              <Label>Image Shape</Label>
              <div className="flex gap-2 flex-wrap">
                {(['circle', 'rounded', 'square'] as LogoStyle[]).map((style) => (
                  <button key={style} type="button" onClick={() => setLogo({ style })}
                    className={`px-3 py-1.5 text-sm border rounded-md capitalize transition-colors ${
                      logo.style === style ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}>
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Layout */}
          <div className="space-y-2">
            <Label>Layout</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { value: 'image-text-side', icon: AlignLeft, label: 'Image + Text side' },
                { value: 'image-text-below', icon: AlignCenter, label: 'Image + Text below' },
                { value: 'image-only', icon: ImageIcon, label: 'Image only' },
                { value: 'text-only', icon: Type, label: 'Text only' },
              ] as { value: LogoLayout; icon: React.ElementType; label: string }[]).map(({ value, icon: Icon, label }) => (
                <button key={value} type="button" onClick={() => setLogo({ layout: value })}
                  className={`flex flex-col items-center gap-1.5 p-3 border rounded-lg text-xs transition-colors ${
                    logo.layout === value ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent border-border text-muted-foreground hover:text-foreground'
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size — only when image is shown */}
          {logo.url && logo.layout !== 'text-only' && (
            <div className="space-y-2">
              <Label>Image Size</Label>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg'] as LogoSize[]).map((size) => (
                  <button key={size} type="button" onClick={() => setLogo({ size })}
                    className={`px-4 py-1.5 text-sm border rounded-md uppercase transition-colors ${
                      logo.size === size ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom text */}
          {logo.layout !== 'image-only' && (
            <div className="space-y-2">
              <Label htmlFor="logo-text">
                Brand Text <span className="text-muted-foreground font-normal text-xs">(defaults to Website Name above)</span>
              </Label>
              <Input
                id="logo-text"
                value={logo.text ?? ''}
                onChange={(e) => setLogo({ text: e.target.value || null })}
                placeholder={settings.website_name || 'My Portfolio'}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Cache</CardTitle>
          <CardDescription>Force fresh portfolio data to load</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Portfolio data (projects, skills, etc.) is cached for 3 days. Clear it if you&apos;ve made changes outside the admin and want them visible now.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearCache} disabled={clearingCache} className="shrink-0">
              {clearingCache ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {clearingCache ? 'Clearing...' : 'Clear Cache'}
            </Button>
          </div>
          {cacheCleared && (
            <Alert className="mt-3 border-green-600 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">Cache cleared successfully.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Errors + Save */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="h-4 w-4" /> Settings saved!
          </div>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving
            ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            : <><Save className="mr-2 h-4 w-4" />Save Settings</>}
        </Button>
      </div>
    </div>
  );
}
