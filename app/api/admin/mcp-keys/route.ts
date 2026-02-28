// Admin API: MCP API Keys Management
// Requires admin session authentication

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';
import {
  createMcpApiKey,
  listMcpApiKeys,
  toggleMcpApiKey,
  deleteMcpApiKey,
  setMcpApiKeyPermission,
} from '@/lib/data/portfolio-repository';

// Validate admin session from cookies
async function validateAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('portfolio_session')?.value;

  if (!sessionToken) {
    return false;
  }

  return verifySession(sessionToken);
}

function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized: Admin session required' },
    { status: 401 }
  );
}

// GET /api/admin/mcp-keys - List all API keys
export async function GET(_request: NextRequest) {
  const isValid = await validateAdminSession();
  if (!isValid) {
    return unauthorizedResponse();
  }

  try {
    const keys = await listMcpApiKeys();
    return NextResponse.json({ keys });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/admin/mcp-keys - Create new API key
export async function POST(request: NextRequest) {
  const isValid = await validateAdminSession();
  if (!isValid) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name, can_write } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Name is required and must be at least 3 characters' },
        { status: 400 }
      );
    }

    const result = await createMcpApiKey(name.trim(), can_write === true);
    
    return NextResponse.json({
      message: 'API key created successfully',
      key: result.key, // Only returned once!
      id: result.id,
      record: result.record,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/mcp-keys - Toggle key enabled or can_write status
export async function PATCH(request: NextRequest) {
  const isValid = await validateAdminSession();
  if (!isValid) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, enabled, can_write } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (typeof enabled === 'boolean') {
      await toggleMcpApiKey(id, enabled);
    }

    if (typeof can_write === 'boolean') {
      await setMcpApiKeyPermission(id, can_write);
    }

    return NextResponse.json({ message: 'API key updated successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/mcp-keys?id=<key-id> - Delete API key
export async function DELETE(request: NextRequest) {
  const isValid = await validateAdminSession();
  if (!isValid) {
    return unauthorizedResponse();
  }

  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await deleteMcpApiKey(id);
    
    return NextResponse.json({
      message: 'API key deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
