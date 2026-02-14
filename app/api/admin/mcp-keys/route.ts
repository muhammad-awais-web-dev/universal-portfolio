// Admin API: MCP API Keys Management
// Requires ADMIN_PASSPHRASE authentication

import { NextRequest, NextResponse } from 'next/server';
import {
  createMcpApiKey,
  listMcpApiKeys,
  toggleMcpApiKey,
  deleteMcpApiKey,
} from '@/lib/data/portfolio-repository';

// Simple passphrase authentication
function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const passphrase = process.env.ADMIN_PASSPHRASE;

  if (!passphrase || !authHeader) {
    return false;
  }

  // Extract passphrase from "Bearer <passphrase>"
  const providedPassphrase = authHeader.replace('Bearer ', '');
  return providedPassphrase === passphrase;
}

function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized: Invalid admin passphrase' },
    { status: 401 }
  );
}

// GET /api/admin/mcp-keys - List all API keys
export async function GET(request: NextRequest) {
  if (!validateAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const keys = await listMcpApiKeys();
    return NextResponse.json({ keys });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/mcp-keys - Create new API key
export async function POST(request: NextRequest) {
  if (!validateAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Name is required and must be at least 3 characters' },
        { status: 400 }
      );
    }

    const result = await createMcpApiKey(name.trim());
    
    return NextResponse.json({
      message: 'API key created successfully',
      key: result.key, // Only returned once!
      id: result.id,
      record: result.record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/mcp-keys - Toggle key enabled status
export async function PATCH(request: NextRequest) {
  if (!validateAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, enabled } = body;

    if (!id || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'ID and enabled status are required' },
        { status: 400 }
      );
    }

    await toggleMcpApiKey(id, enabled);
    
    return NextResponse.json({
      message: `API key ${enabled ? 'enabled' : 'disabled'} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/mcp-keys?id=<key-id> - Delete API key
export async function DELETE(request: NextRequest) {
  if (!validateAdminAuth(request)) {
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
