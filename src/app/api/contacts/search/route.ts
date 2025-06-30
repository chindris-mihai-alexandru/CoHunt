import { NextRequest, NextResponse } from 'next/server';
import { apolloService } from '@/lib/api/apollo';
import { hunterService } from '@/lib/api/hunter';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, company, location, skills, limit = 25 } = await request.json();

    if (!title && !company) {
      return NextResponse.json(
        { error: 'Either title or company is required' },
        { status: 400 }
      );
    }

    // Search for contacts using Apollo.io
    const contacts = await apolloService.searchContacts({
      title,
      company,
      location,
      skills,
      limit,
    });

    // Verify emails using Hunter.io for the first 10 contacts
    const contactsToVerify = contacts.slice(0, 10);
    const emailVerifications = await Promise.all(
      contactsToVerify.map(async (contact) => {
        if (contact.email) {
          const verification = await hunterService.verifyEmail(contact.email);
          return {
            ...contact,
            emailVerification: verification,
            emailScore: verification ? hunterService.getEmailScore(verification) : 0,
            emailRecommended: verification ? hunterService.isEmailRecommended(verification) : false,
          };
        }
        return contact;
      })
    );

    // Add unverified contacts
    const remainingContacts = contacts.slice(10);
    const allContacts = [...emailVerifications, ...remainingContacts];

    // Sort by email score (verified emails first)
    allContacts.sort((a, b) => {
      const scoreA = a.emailScore || 0;
      const scoreB = b.emailScore || 0;
      return scoreB - scoreA;
    });

    return NextResponse.json({
      contacts: allContacts,
      total: allContacts.length,
      verified: emailVerifications.length,
    });

  } catch (error) {
    console.error('Contact search error:', error);
    return NextResponse.json(
      { error: 'Failed to search contacts' },
      { status: 500 }
    );
  }
}