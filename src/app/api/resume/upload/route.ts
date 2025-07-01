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

    // Parse form data
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;

    if (!resumeFile) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents are allowed' }, { status: 400 });
    }

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('resumes')
      .upload(`${user.id}/${Date.now()}_${resumeFile.name}`, resumeFile);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(storageData.path);

    // Extract text from resume
    // In a real app, you would use a library like pdf-parse or a service like OpenAI
    // For now, we'll just use a placeholder
    const resumeText = `Professional resume for ${user.user_metadata?.name || 'User'}`;

    // Update user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resumeUrl: publicUrl,
        resumeText
      }
    });

    return NextResponse.json({
      success: true,
      resumeUrl: publicUrl
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload resume' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}