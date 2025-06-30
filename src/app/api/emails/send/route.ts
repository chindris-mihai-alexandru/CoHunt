import { NextRequest, NextResponse } from 'next/server';
import { resendService } from '@/lib/api/resend';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      recipients, 
      subject, 
      template, 
      campaignId,
      scheduleFor 
    } = await request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients array is required' },
        { status: 400 }
      );
    }

    if (!subject || !template) {
      return NextResponse.json(
        { error: 'Subject and template are required' },
        { status: 400 }
      );
    }

    // Get user profile for sender info
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const fromEmail = `${userProfile.name} <${userProfile.email}>`;
    const results = [];

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        // Personalize the email content
        const personalizedContent = resendService.createPersonalizedEmail(
          template,
          recipient,
          {
            '{{recruiterName}}': userProfile.name || 'Recruiter',
            '{{recruiterEmail}}': userProfile.email || '',
          }
        );

        // Send the email
        const emailResponse = await resendService.sendEmail({
          to: [recipient.email],
          from: fromEmail,
          subject: subject,
          html: personalizedContent,
          tags: [
            { name: 'campaign_id', value: campaignId || 'manual' },
            { name: 'recipient_type', value: 'candidate' },
          ],
        });

        if (emailResponse) {
          results.push({
            recipient: recipient.email,
            status: 'sent',
            emailId: emailResponse.id,
          });

          // Log the email in database (optional)
          // You could create an EmailLog table to track sent emails
        } else {
          results.push({
            recipient: recipient.email,
            status: 'failed',
            error: 'Failed to send email',
          });
        }
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        results.push({
          recipient: recipient.email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      results,
    });

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}