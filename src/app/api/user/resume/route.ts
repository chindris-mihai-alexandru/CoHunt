import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user's resume versions
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get resume versions
    const resumeVersions = await prisma.resumeVersion.findMany({
      where: {
        userId: user.id
      },
      orderBy: [
        { isDefault: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    // Get user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        resumeText: true,
        resumeUrl: true,
        skills: true
      }
    });

    return NextResponse.json({
      resumeVersions,
      userData
    });
  } catch (error) {
    console.error('Get resume versions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get resume versions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Create or update resume version
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
    const { id, name, content, isDefault, optimizedFor } = body;

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    let resumeVersion;

    if (id) {
      // Check if resume version exists and belongs to user
      const existingVersion = await prisma.resumeVersion.findUnique({
        where: {
          id,
          userId: user.id
        }
      });

      if (!existingVersion) {
        return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
      }

      // Update resume version
      resumeVersion = await prisma.resumeVersion.update({
        where: { id },
        data: {
          name,
          content,
          isDefault: isDefault || false,
          optimizedFor,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new resume version
      resumeVersion = await prisma.resumeVersion.create({
        data: {
          userId: user.id,
          name,
          content,
          isDefault: isDefault || false,
          optimizedFor
        }
      });
    }

    // If this version is set as default, update other versions
    if (isDefault) {
      await prisma.resumeVersion.updateMany({
        where: {
          userId: user.id,
          id: { not: resumeVersion.id }
        },
        data: {
          isDefault: false
        }
      });
    }

    return NextResponse.json({ resumeVersion });
  } catch (error) {
    console.error('Create/update resume version error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create/update resume version' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Delete resume version
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get resume version ID from URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resume version ID is required' }, { status: 400 });
    }

    // Check if resume version exists and belongs to user
    const resumeVersion = await prisma.resumeVersion.findUnique({
      where: {
        id,
        userId: user.id
      }
    });

    if (!resumeVersion) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    // Check if this is the default version
    if (resumeVersion.isDefault) {
      return NextResponse.json({ error: 'Cannot delete the default resume version' }, { status: 400 });
    }

    // Delete resume version
    await prisma.resumeVersion.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete resume version error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete resume version' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}