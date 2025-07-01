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
    const { jobId, notes, resumeVersionId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if application already exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobId,
        notes,
        resumeVersionId,
        status: 'applied',
        appliedAt: new Date(),
        lastUpdated: new Date()
      }
    });

    // If job was saved, delete from saved jobs
    try {
      await prisma.savedJob.delete({
        where: {
          userId_jobId: {
            userId: user.id,
            jobId
          }
        }
      });
    } catch (error) {
      // Ignore error if job wasn't saved
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Apply to job error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply to job' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}