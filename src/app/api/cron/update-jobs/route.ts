import { NextRequest, NextResponse } from 'next/server';
import { JobScraper } from '@/lib/jobs/scraper';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Verify this is called by your cron service (e.g., Vercel Cron)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const scraper = new JobScraper();

  try {
    // Popular search queries to keep jobs fresh
    const queries = [
      'software engineer',
      'frontend developer',
      'backend developer',
      'full stack developer',
      'data scientist',
      'product manager',
      'designer',
      'devops engineer'
    ];

    const locations = ['Remote', 'New York', 'San Francisco', 'London', 'Berlin'];

    let totalJobsScraped = 0;

    // Scrape jobs for various combinations
    for (const query of queries) {
      for (const location of locations) {
        const jobsCount = await scraper.scrapeAndSaveJobs(query, location);
        totalJobsScraped += jobsCount;
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Mark old jobs as inactive
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.job.updateMany({
      where: {
        scrapedAt: {
          lt: thirtyDaysAgo
        }
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      success: true,
      jobsScraped: totalJobsScraped,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to update jobs' },
      { status: 500 }
    );
  } finally {
    // Clean up Prisma connections
    await scraper.disconnect();
    await prisma.$disconnect();
  }
} 