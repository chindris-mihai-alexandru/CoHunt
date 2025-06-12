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

  try {
    const scraper = new JobScraper();
    
    // Get popular search queries from the last 7 days
    const popularSearches = await prisma.searchHistory.groupBy({
      by: ['query'],
      _count: {
        query: true
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: 20
    });

    // Scrape jobs for popular searches
    let totalJobsScraped = 0;
    for (const search of popularSearches) {
      const jobsCount = await scraper.scrapeAndSaveJobs(search.query);
      totalJobsScraped += jobsCount;
    }

    // Mark old jobs as inactive
    await prisma.job.updateMany({
      where: {
        scrapedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days old
        }
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      success: true,
      jobsScraped: totalJobsScraped,
      searchesProcessed: popularSearches.length
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to update jobs' },
      { status: 500 }
    );
  }
} 