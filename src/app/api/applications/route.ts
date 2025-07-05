import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Get all applications for the current user
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ApplicationWhereInput = {
      userId: user.id
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get applications
    const applications = await prisma.application.findMany({
      where,
      include: {
        job: true,
        communications: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 5
        },
        resumeVersion: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { lastUpdated: 'desc' }
      ],
      take: limit,
      skip
    });

    // Get total count
    const totalCount = await prisma.application.count({ where });

    return NextResponse.json({
      applications,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get applications' },
      { status: 500 }
    );
  }
}

// Update application status
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { id, status, notes, nextAction, nextActionDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: {
        id,
        userId: user.id
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: status || application.status,
        notes: notes !== undefined ? notes : application.notes,
        nextAction: nextAction !== undefined ? nextAction : application.nextAction,
        nextActionDate: nextActionDate !== undefined ? new Date(nextActionDate) : application.nextActionDate,
        lastUpdated: new Date()
      },
      include: {
        job: true
      }
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update application' },
      { status: 500 }
    );
  }
}

// Delete application
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get application ID from URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: {
        id,
        userId: user.id
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Delete application
    await prisma.application.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete application' },
      { status: 500 }
    );
  }
}