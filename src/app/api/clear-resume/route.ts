import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clear resume from user profile
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resumeText: null,
        resumeUrl: null,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Clear resume error:', error);
    return NextResponse.json(
      { error: 'Failed to clear resume' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 