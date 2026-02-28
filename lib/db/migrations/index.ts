// Migration registry — ordered list of all database migrations
// Each entry has a unique name and the SQL to execute.
// The migration runner tracks which ones have been applied.

import { migration_001_initial_schema } from './001_initial_schema';
import { migration_002_testimonials } from './002_testimonials';
import { migration_003_mcp_api_keys } from './003_mcp_api_keys';
import { migration_004_mcp_api_key_permissions } from './004_mcp_api_key_permissions';
import { migration_005_site_settings } from './005_site_settings';
import { migration_006_integrations } from './006_integrations';

export interface Migration {
  name: string;
  sql: string;
}

export const MIGRATIONS: Migration[] = [
  { name: '001_initial_schema', sql: migration_001_initial_schema },
  { name: '002_testimonials', sql: migration_002_testimonials },
  { name: '003_mcp_api_keys', sql: migration_003_mcp_api_keys },
  { name: '004_mcp_api_key_permissions', sql: migration_004_mcp_api_key_permissions },
  { name: '005_site_settings', sql: migration_005_site_settings },
  { name: '006_integrations', sql: migration_006_integrations },
];
