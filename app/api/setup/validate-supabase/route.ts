/**
 * API route to validate Supabase connection
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { valid: false, error: 'Credentials not configured' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch {
      return NextResponse.json(
        { valid: false, error: 'Invalid Supabase URL format' },
        { status: 400 }
      );
    }

    // Try to create a client and make a simple query to test connection
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    
    // Test connection by querying the profiles table (created in migration)
    // We don't care if it's empty, just that we can connect
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      // If we get a table doesn't exist error, check if it's just not migrated yet
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        // Table doesn't exist but connection works - return success
        return NextResponse.json({ valid: true, note: 'Connection works but tables may not be migrated' });
      }
      
      // Check for auth errors (invalid credentials)
      if (error.message.includes('JWT') || error.message.includes('authentication') || error.message.includes('apikey')) {
        return NextResponse.json(
          { valid: false, error: 'Invalid credentials' },
          { status: 400 }
        );
      }
      
      // Other errors might be network/connection issues
      return NextResponse.json(
        { valid: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Supabase validation error:', error);
    return NextResponse.json(
      { valid: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
