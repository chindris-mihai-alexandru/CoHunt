import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in database
    const userData = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
      },
      select: { isPremium: true }
    });

    // Get today's search count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const searchCount = await prisma.search.count({
      where: {
        userId: user.id,
        createdAt: { gte: today }
      }
    });

    const dailyLimit = parseInt(process.env.FREE_SEARCHES_PER_DAY || '10');
    const searchesRemaining = userData.isPremium ? 999 : Math.max(0, dailyLimit - searchCount);

    return NextResponse.json({
      isPremium: userData.isPremium,
      searchesRemaining,
      searchCount
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}