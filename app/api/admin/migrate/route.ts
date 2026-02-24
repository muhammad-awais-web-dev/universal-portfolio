import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-guard';
import { runPendingMigrations, getMigrationStatus, BOOTSTRAP_SQL } from '@/lib/db/migrate';

/** Extract the Supabase project ref from SUPABASE_URL (e.g. "abcxyz" from "https://abcxyz.supabase.co") */
function getSupabaseProjectRef(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) return null;
  try {
    const host = new URL(url).hostname; // e.g. "abcxyz.supabase.co"
    return host.split('.')[0] || null;
  } catch {
    return null;
  }
}

/** GET /api/admin/migrate — Check migration status */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const status = await getMigrationStatus();
    const projectRef = getSupabaseProjectRef();
    return NextResponse.json({
      ...status,
      bootstrapSQL: BOOTSTRAP_SQL,
      supabaseSqlEditorUrl: projectRef
        ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
        : 'https://supabase.com/dashboard',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check migration status', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/** POST /api/admin/migrate — Run all pending migrations */
export async function POST() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const result = await runPendingMigrations();

    const status = result.errors.length > 0 ? 500 : 200;
    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Migration runner failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
