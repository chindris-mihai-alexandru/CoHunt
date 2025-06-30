import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test the connection with a simple query
    const { data, error } = await supabase.from('User').select('id').limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to Supabase', 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase',
      data: {
        userCount: data?.length || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error testing Supabase connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}