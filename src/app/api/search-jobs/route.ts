import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { JobScraper } from '@/lib/jobs/scraper';
import { jobCacheService } from '@/lib/cache/job-cache';

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

      // Record the search (only if user exists in database)
      try {
        // First ensure user exists in our database
        await prisma.user.upsert({
          where: { id: user.id },
          update: {}, // Don't update anything if exists
          create: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
          }
        });

        // Now record the search
        await prisma.search.create({
          data: {
            userId: user.id,
            query,
            location,
            jobType
          }
        });
      } catch (dbError) {
        console.error('Error recording search:', dbError);
        // Continue with search even if recording fails
      }
    }
    // First, check cache for recent results
    let jobs = jobCacheService.get(query, location);

    if (!jobs) {
      console.log('Cache miss, checking database...');
      
      // Check if we have recent jobs in database - be more flexible with search
      const recentJobs = await prisma.job.findMany({
        where: {
          isActive: true,
          scrapedAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } // Last 2 hours
        },
        take: 20,
        orderBy: { scrapedAt: 'desc' }
      });

      jobs = recentJobs;
      console.log(`Found ${jobs.length} recent jobs in database`);

      // If we don't have enough recent jobs, scrape new ones
      if (jobs.length < 5) {
        console.log('Insufficient recent jobs, starting fresh scrape...');
        
        try {
          const scraper = new JobScraper();
          const scrapedCount = await scraper.scrapeAndSaveJobs(query, location || '');
          console.log(`Scraped ${scrapedCount} new jobs`);
          
          // Fetch again after scraping - return all recent jobs
          jobs = await prisma.job.findMany({
            where: {
              isActive: true
            },
            take: 20,
            orderBy: { scrapedAt: 'desc' }
          });
          
          console.log(`After scraping, found ${jobs.length} jobs in database`);
          
        } catch (scrapeError) {
          console.error('Job scraping failed:', scrapeError);
          // Continue with existing jobs if scraping fails
          if (jobs.length === 0) {
            return NextResponse.json(
              { error: 'Unable to find jobs at the moment. Please try again later.' },
              { status: 503 }
            );
          }
        }
      }

      // Cache the results for future requests
      if (jobs.length > 0) {
        jobCacheService.set(query, jobs, location);
      }
    }

    // Calculate match scores if user has resume
    let jobsWithScores = jobs;
    if (user) {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { resumeText: true }
      });

      if (userData?.resumeText) {
        // Use OpenAI to calculate match scores with rate limiting
        const matchPromises = jobs.slice(0, 10).map(async (job, index) => {
          try {
            // Add delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, index * 100));
            
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
              timeout: 10000, // 10 second timeout
            });

            let score = parseInt(response.choices[0].message.content || '0');
            score = isNaN(score) ? 50 : score; // Default to 50 if parsing fails
            return { ...job, matchScore: Math.min(100, Math.max(0, score)) };
          } catch (error) {
            console.error(`Error calculating match score for job ${job.id}:`, error);
            // Return job with a default score instead of undefined
            return { ...job, matchScore: 50 };
          }
        });

        // Add unprocessed jobs (if more than 10) without scores
        const remainingJobs = jobs.slice(10).map(job => ({ ...job, matchScore: undefined }));

        const processedJobs = await Promise.all(matchPromises);
        jobsWithScores = [...processedJobs, ...remainingJobs];
        
        // Sort by match score (jobs with scores first)
        jobsWithScores.sort((a, b) => {
          if (a.matchScore !== undefined && b.matchScore !== undefined) {
            return b.matchScore - a.matchScore;
          }
          if (a.matchScore !== undefined) return -1;
          if (b.matchScore !== undefined) return 1;
          return 0;
        });
      }
    }

    // Record search history
    if (user) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId: user.id,
            query,
            location,
            resultsCount: jobsWithScores.length
          }
        });
      } catch (historyError) {
        console.error('Error recording search history:', historyError);
        // Continue anyway
      }
    }

    console.log(`Returning ${jobsWithScores.length} jobs to client`);
    return NextResponse.json({ jobs: jobsWithScores });

  } catch (error) {
    console.error('Job search error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Firecrawl')) {
        return NextResponse.json(
          { error: 'Job search service temporarily unavailable. Please try again in a few minutes.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before searching again.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Search timeout. Please try a more specific query.' },
          { status: 408 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while searching for jobs. Please try again.' },
      { status: 500 }
    );
  } finally {
    // Ensure database connection is closed
    await prisma.$disconnect();
  }
}