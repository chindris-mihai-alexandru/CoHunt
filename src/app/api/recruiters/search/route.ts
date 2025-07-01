import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const specialization = url.searchParams.get('specialization');
    const location = url.searchParams.get('location');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true
    };

    if (specialization) {
      where.specializations = {
        has: specialization
      };
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get recruiters
    const recruiters = await prisma.recruiter.findMany({
      where,
      include: {
        placements: {
          take: 3,
          orderBy: {
            placedAt: 'desc'
          }
        }
      },
      orderBy: [
        { isVerified: 'desc' },
        { placementsMade: 'desc' }
      ],
      take: limit,
      skip
    });

    // Get total count
    const totalCount = await prisma.recruiter.count({ where });

    return NextResponse.json({
      recruiters,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Recruiter search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search recruiters' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}