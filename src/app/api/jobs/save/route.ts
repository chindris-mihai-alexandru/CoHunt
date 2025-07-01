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
    const { jobId, notes } = body;

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

    // Check if job is already saved
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId
        }
      }
    });

    if (existingSavedJob) {
      // Update existing saved job
      const updatedSavedJob = await prisma.savedJob.update({
        where: {
          id: existingSavedJob.id
        },
        data: {
          notes
        }
      });

      return NextResponse.json({ savedJob: updatedSavedJob });
    } else {
      // Create new saved job
      const savedJob = await prisma.savedJob.create({
        data: {
          userId: user.id,
          jobId,
          notes
        }
      });

      return NextResponse.json({ savedJob });
    }
  } catch (error) {
    console.error('Save job error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save job' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get job ID from URL
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Delete saved job
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsave job error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unsave job' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}