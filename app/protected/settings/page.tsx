'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/settings/general-settings';
import { ApiKeysSettings } from '@/components/settings/api-keys-settings';
import { CredentialValidationSection } from '@/components/settings/credential-validation';
import { DatabaseMigrationsSettings } from '@/components/settings/database-migrations-settings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio settings, API keys, and configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4 mt-6">
          <ApiKeysSettings />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4 mt-6">
          <CredentialValidationSection />
        </TabsContent>

        <TabsContent value="database" className="space-y-4 mt-6">
          <DatabaseMigrationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
