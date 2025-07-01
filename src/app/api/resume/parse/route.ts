import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { resumeUrl } = body;

    if (!resumeUrl) {
      return NextResponse.json({ error: 'Resume URL is required' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Call OpenAI API to parse resume
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume parser. Extract structured information from the resume text provided.'
          },
          {
            role: 'user',
            content: `Parse the following resume and extract structured information:
            
            ${resumeUrl}
            
            Please extract:
            1. Contact information (name, email, phone, location)
            2. Professional summary
            3. Skills (as an array)
            4. Work experience (company, position, duration, description)
            5. Education (institution, degree, date)
            
            Return the data in JSON format.`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const parsedResume = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ resume: parsedResume });
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    );
  }
}