import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user profile
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        phoneNumber: true,
        linkedinUrl: true,
        websiteUrl: true,
        skills: true,
        experienceLevel: true,
        desiredSalaryMin: true,
        desiredSalaryMax: true,
        isOpenToWork: true,
        preferredWorkType: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update user profile
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
    const { 
      name, 
      location, 
      phoneNumber, 
      linkedinUrl, 
      websiteUrl, 
      skills, 
      experienceLevel,
      desiredSalaryMin,
      desiredSalaryMax,
      isOpenToWork,
      preferredWorkType
    } = body;

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        location,
        phoneNumber,
        linkedinUrl,
        websiteUrl,
        skills,
        experienceLevel,
        desiredSalaryMin,
        desiredSalaryMax,
        isOpenToWork,
        preferredWorkType,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}