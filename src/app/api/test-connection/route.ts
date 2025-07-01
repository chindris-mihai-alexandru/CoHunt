import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic API functionality
    const timestamp = new Date().toISOString();
    
    // Test environment variables
    const hasFirecrawl = !!process.env.FIRECRAWL_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    return NextResponse.json({
      status: 'success',
      message: 'API connection test successful',
      timestamp,
      environment: {
        firecrawl: hasFirecrawl ? 'configured' : 'missing',
        openai: hasOpenAI ? 'configured' : 'missing',
        supabase: hasSupabase ? 'configured' : 'missing',
      },
      endpoints: {
        jobSearch: '/api/search-jobs',
        testConnection: '/api/test-connection',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'POST request test successful',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'POST request test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}