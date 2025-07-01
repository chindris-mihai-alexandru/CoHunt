import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { jobId, resumeId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Get job from database
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get user's resume
    let resumeData;
    if (resumeId) {
      // Get specific resume version
      const resumeVersion = await prisma.resumeVersion.findUnique({
        where: {
          id: resumeId,
          userId: user.id
        }
      });

      if (!resumeVersion) {
        return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
      }

      resumeData = resumeVersion.content;
    } else {
      // Get default resume or user data
      const userData = await prisma.user.findUnique({
        where: { id: user.id }
      });

      if (!userData || !userData.resumeText) {
        return NextResponse.json({ error: 'User resume not found' }, { status: 404 });
      }

      // Get default resume version if exists
      const defaultResume = await prisma.resumeVersion.findFirst({
        where: {
          userId: user.id,
          isDefault: true
        }
      });

      resumeData = defaultResume?.content || { 
        summary: userData.resumeText,
        skills: userData.skills || []
      };
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Call OpenAI API to tailor resume
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
            content: 'You are an expert resume tailoring assistant. Your task is to tailor a resume to match a specific job description.'
          },
          {
            role: 'user',
            content: `Please tailor the following resume to match this job description:
            
            RESUME:
            ${JSON.stringify(resumeData, null, 2)}
            
            JOB DESCRIPTION:
            Title: ${job.title}
            Company: ${job.company}
            Description: ${job.description}
            Requirements: ${job.requirements.join('\n')}
            
            Provide the tailored resume in JSON format, along with a list of changes made and why.`
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
    const tailoredResume = JSON.parse(data.choices[0].message.content);

    // Save tailored resume version
    const resumeVersion = await prisma.resumeVersion.create({
      data: {
        userId: user.id,
        name: `${job.title} at ${job.company}`,
        content: tailoredResume.resume,
        optimizedFor: job.title,
        isDefault: false
      }
    });

    return NextResponse.json({
      resumeVersion,
      changes: tailoredResume.changes,
      suggestions: tailoredResume.suggestions
    });
  } catch (error) {
    console.error('Resume tailoring error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to tailor resume' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}