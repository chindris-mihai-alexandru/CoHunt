import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add communication to application
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
    const { applicationId, type, subject, content, isInbound } = body;

    if (!applicationId || !type || !content) {
      return NextResponse.json({ error: 'Application ID, type, and content are required' }, { status: 400 });
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        userId: user.id
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Create communication
    const communication = await prisma.communication.create({
      data: {
        userId: user.id,
        applicationId,
        type,
        subject,
        content,
        isInbound: isInbound || false,
        sentAt: new Date()
      }
    });

    // Update application last updated timestamp
    await prisma.application.update({
      where: { id: applicationId },
      data: { lastUpdated: new Date() }
    });

    return NextResponse.json({ communication });
  } catch (error) {
    console.error('Add communication error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add communication' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Get communications for an application
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get application ID from URL
    const url = new URL(request.url);
    const applicationId = url.searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        userId: user.id
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Get communications
    const communications = await prisma.communication.findMany({
      where: {
        applicationId
      },
      orderBy: {
        sentAt: 'desc'
      }
    });

    return NextResponse.json({ communications });
  } catch (error) {
    console.error('Get communications error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get communications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}