import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { JobScraper } from '@/lib/jobs/scraper';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { query, location, jobType } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check search limits for non-premium users
    if (user) {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isPremium: true }
      });

      if (!userData?.isPremium) {
        // Check today's search count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const searchCount = await prisma.search.count({
          where: {
            userId: user.id,
            createdAt: { gte: today }
          }
        });

        const limit = parseInt(process.env.FREE_SEARCHES_PER_DAY || '3');
        if (searchCount >= limit) {
          return NextResponse.json(
            { error: 'Daily search limit reached. Upgrade to premium for unlimited searches.' },
            { status: 429 }
          );
        }
      }

      // Record the search
      await prisma.search.create({
        data: {
          userId: user.id,
          query,
          location,
          jobType
        }
      });
    }
    // First, check if we have recent jobs in database
    const recentJobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ],
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        isActive: true,
        scrapedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      },
      take: 20,
      orderBy: { scrapedAt: 'desc' }
    });

    let jobs = recentJobs;

    // If we don't have enough recent jobs, scrape new ones
    if (jobs.length < 5) {
      const scraper = new JobScraper();
      await scraper.scrapeAndSaveJobs(query, location || '');
      
      // Fetch again after scraping
      jobs = await prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          location: location ? { contains: location, mode: 'insensitive' } : undefined,
          isActive: true
        },
        take: 20,
        orderBy: { scrapedAt: 'desc' }
      });
    }

    // Calculate match scores if user has resume
    let jobsWithScores = jobs;
    if (user) {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { resumeText: true }
      });

      if (userData?.resumeText) {
        // Use OpenAI to calculate match scores
        const matchPromises = jobs.map(async (job) => {
          try {
            const response = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are a job matching expert. Rate how well this job matches the candidate's resume on a scale of 0-100."
                },
                {
                  role: "user",
                  content: `Resume: ${userData.resumeText}\n\nJob: ${job.title} at ${job.company}\n${job.description}\n\nProvide only a number between 0-100.`
                }
              ],
              max_tokens: 10,
              temperature: 0.3,
            });

            let score = parseInt(response.choices[0].message.content || '0');
            score = isNaN(score) ? 0 : score;
            return { ...job, matchScore: Math.min(100, Math.max(0, score)) };
          } catch (error) {
            console.error('Error calculating match score:', error);
            return { ...job, matchScore: undefined };
          }
        });

        jobsWithScores = await Promise.all(matchPromises);
        
        // Sort by match score
        jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }
    }

    // Record search history
    if (user) {
      await prisma.searchHistory.create({
        data: {
          userId: user.id,
          query,
          location,
          resultsCount: jobsWithScores.length
        }
      });
    }

    return NextResponse.json({ jobs: jobsWithScores });

  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    );
  }
}