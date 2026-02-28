'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GeneralSettings } from '@/components/settings/general-settings';
import { ApiKeysSettings } from '@/components/settings/api-keys-settings';
import { CredentialValidationSection } from '@/components/settings/credential-validation';
import { DatabaseMigrationsSettings } from '@/components/settings/database-migrations-settings';

type Tab = 'general' | 'api-keys' | 'credentials' | 'database';
const VALID_TABS: Tab[] = ['general', 'api-keys', 'credentials', 'database'];

function SettingsContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('tab') ?? 'general';
  const tab: Tab = VALID_TABS.includes(raw as Tab) ? (raw as Tab) : 'general';

  return (
    <div className="max-w-3xl">
      {tab === 'general' && <GeneralSettings />}
      {tab === 'api-keys' && <ApiKeysSettings />}
      {tab === 'credentials' && <CredentialValidationSection />}
      {tab === 'database' && <DatabaseMigrationsSettings />}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <SettingsContent />
    </Suspense>
  );
}

