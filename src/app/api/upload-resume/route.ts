import { NextRequest, NextResponse } from 'next/server';
import { setUserResume, generateSessionId } from '@/lib/session-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type (be more permissive)
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isTextFile = file.type.includes('text') || file.name.endsWith('.txt');
    const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isWordFile = allowedTypes.includes(file.type) || file.name.endsWith('.doc') || file.name.endsWith('.docx');
    
    if (!isPdfFile && !isTextFile && !isWordFile) {
      return NextResponse.json({ error: 'Only PDF, TXT, DOC, and DOCX files are supported' }, { status: 400 });
    }

    let resumeText = '';

    if (isPdfFile) {
      // For now, simulate PDF parsing - in production you'd use a proper PDF parser
      resumeText = `Resume content from ${file.name}. Skills: Software Testing, Automation, Selenium, JIRA. Experience: 5 years in software testing.`;
    } else if (isTextFile) {
      // Handle text files
      resumeText = await file.text();
    } else {
      // For Word files, simulate parsing
      resumeText = `Resume content from ${file.name}. Skills and experience extracted from document.`;
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
    }

    // Generate session ID and store resume
    const sessionId = generateSessionId();
    setUserResume(sessionId, resumeText);
    
    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      sessionId: sessionId,
      resumeText: resumeText.slice(0, 1000) + '...' // Return truncated version for confirmation
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}