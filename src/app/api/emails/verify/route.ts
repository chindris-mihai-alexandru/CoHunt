import { NextRequest, NextResponse } from 'next/server';
import { hunterService } from '@/lib/api/hunter';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Emails array is required' },
        { status: 400 }
      );
    }

    if (emails.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 emails allowed per request' },
        { status: 400 }
      );
    }

    // Verify emails using Hunter.io
    const verifications = await hunterService.bulkVerifyEmails(emails);

    // Process results
    const results = verifications.map(verification => ({
      email: verification.email,
      result: verification.result,
      score: hunterService.getEmailScore(verification),
      recommended: hunterService.isEmailRecommended(verification),
      details: {
        deliverable: verification.result === 'deliverable',
        risky: verification.result === 'risky',
        disposable: verification.disposable,
        webmail: verification.webmail,
        mx_records: verification.mx_records,
        smtp_check: verification.smtp_check,
      },
    }));

    // Calculate summary stats
    const summary = {
      total: results.length,
      deliverable: results.filter(r => r.result === 'deliverable').length,
      risky: results.filter(r => r.result === 'risky').length,
      undeliverable: results.filter(r => r.result === 'undeliverable').length,
      unknown: results.filter(r => r.result === 'unknown').length,
      recommended: results.filter(r => r.recommended).length,
      averageScore: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    };

    return NextResponse.json({
      results,
      summary,
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify emails' },
      { status: 500 }
    );
  }
}