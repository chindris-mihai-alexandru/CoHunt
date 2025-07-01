import { NextRequest, NextResponse } from 'next/server';
import { openaiMatcherService } from '@/lib/jobs/openai-matcher';
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
    const { jobId } = body;

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

    // Get user's resume data
    const userData = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!userData || !userData.resumeText) {
      return NextResponse.json({ error: 'User resume not found' }, { status: 404 });
    }

    // Parse resume text to extract structured data
    // In a real app, you would have a more sophisticated resume parser
    const resumeData = {
      summary: userData.resumeText.split('\n\n')[0], // Assume first paragraph is summary
      skills: userData.skills || [],
      experience: [] // Would be parsed from resumeText in a real app
    };

    // Calculate match score
    const matchResult = await openaiMatcherService.calculateJobMatch(
      resumeData,
      {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        url: job.url,
        source: job.source
      }
    );

    return NextResponse.json({
      job: {
        ...job,
        matchScore: matchResult.matchScore,
        matchReason: matchResult.matchReason,
        keySkillMatches: matchResult.keySkillMatches,
        missingSkills: matchResult.missingSkills,
        improvementSuggestions: matchResult.improvementSuggestions
      }
    });
  } catch (error) {
    console.error('Job match error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate job match' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}