// In-app database migration runner
// Uses the Supabase service role key to run pending migrations via an `exec_sql` helper function.
// The exec_sql function must be created once in the Supabase SQL editor (see getBootstrapSQL).
// After that, all future migrations run automatically from the admin UI.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MIGRATIONS, type Migration } from './migrations/index';

export interface MigrationStatus {
  name: string;
  applied: boolean;
  appliedAt?: string;
}

export interface MigrationResult {
  applied: string[];
  skipped: string[];
  errors: { name: string; error: string }[];
  needsBootstrap?: boolean;
}

/** SQL to run once in Supabase SQL editor to enable in-app migrations */
export const BOOTSTRAP_SQL = `
-- Run this ONCE in your Supabase SQL Editor to enable in-app migrations.
-- After this, all future migrations run automatically from the admin settings page.

CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Create the migrations tracking table
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT now()
);
`.trim();

function getAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to run migrations');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function checkBootstrapReady(client: SupabaseClient): Promise<boolean> {
  // Check if schema_migrations table exists as a proxy for bootstrap being done
  const { error } = await client.from('schema_migrations').select('name').limit(1);
  return !error;
}

async function getAppliedMigrations(client: SupabaseClient): Promise<Map<string, string>> {
  const { data, error } = await client
    .from('schema_migrations')
    .select('name, applied_at');

  if (error) throw new Error(`Failed to read applied migrations: ${error.message}`);
  return new Map((data || []).map((r: { name: string; applied_at: string }) => [r.name, r.applied_at]));
}

async function runMigration(
  client: SupabaseClient,
  migration: Migration
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: sqlError } = await (client.rpc as any)('exec_sql', { sql_query: migration.sql });
  if (sqlError) throw new Error(sqlError.message);

  const { error: trackError } = await client
    .from('schema_migrations')
    .insert({ name: migration.name });

  if (trackError) throw new Error(`Migration ran but failed to record: ${trackError.message}`);
}

/** Run all pending migrations. Returns which were applied, skipped, or errored. */
export async function runPendingMigrations(): Promise<MigrationResult> {
  const client = getAdminClient();
  const result: MigrationResult = { applied: [], skipped: [], errors: [] };

  try {
    const ready = await checkBootstrapReady(client);
    if (!ready) {
      result.needsBootstrap = true;
      result.errors.push({
        name: 'bootstrap',
        error: 'Bootstrap SQL has not been run. Please run the bootstrap SQL in your Supabase SQL Editor first.',
      });
      return result;
    }

    const applied = await getAppliedMigrations(client);

    for (const migration of MIGRATIONS) {
      if (applied.has(migration.name)) {
        result.skipped.push(migration.name);
        continue;
      }

      try {
        await runMigration(client, migration);
        result.applied.push(migration.name);
      } catch (err) {
        result.errors.push({
          name: migration.name,
          error: err instanceof Error ? err.message : String(err),
        });
        break; // Stop on first error to avoid cascading failures
      }
    }
  } catch (err) {
    result.errors.push({
      name: 'setup',
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return result;
}

/** Get the status of all migrations (applied vs pending). */
export async function getMigrationStatus(): Promise<{
  bootstrapReady: boolean;
  migrations: MigrationStatus[];
}> {
  const client = getAdminClient();

  try {
    const ready = await checkBootstrapReady(client);
    if (!ready) {
      return {
        bootstrapReady: false,
        migrations: MIGRATIONS.map((m) => ({ name: m.name, applied: false })),
      };
    }

    const applied = await getAppliedMigrations(client);

    return {
      bootstrapReady: true,
      migrations: MIGRATIONS.map((m) => ({
        name: m.name,
        applied: applied.has(m.name),
        appliedAt: applied.get(m.name),
      })),
    };
  } catch {
    return {
      bootstrapReady: false,
      migrations: MIGRATIONS.map((m) => ({ name: m.name, applied: false })),
    };
  }
}
