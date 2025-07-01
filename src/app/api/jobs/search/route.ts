import { NextRequest, NextResponse } from 'next/server';
import { firecrawlService, JobSearchFilters } from '@/lib/jobs/firecrawl-service';
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

    // Parse request body
    const body = await request.json();
    const { query, location, remote, experienceLevel, jobType, salary, datePosted, limit, sources } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Create search filters
    const filters: JobSearchFilters = {
      query,
      location,
      remote,
      experienceLevel,
      jobType,
      salary,
      datePosted,
      limit: limit || 20,
      sources
    };

    // Search for jobs
    const jobs = await firecrawlService.searchJobs(filters);

    // Save search to history
    await prisma.searchHistory.create({
      data: {
        userId: user.id,
        query,
        location,
        filters: {
          remote,
          experienceLevel,
          jobType,
          salary,
          datePosted,
          sources
        },
        resultsCount: jobs.length
      }
    });

    // Save jobs to database
    const savedJobs = await Promise.all(
      jobs.map(async job => {
        // Check if job already exists
        const existingJob = job.externalId 
          ? await prisma.job.findUnique({ where: { externalId: job.externalId } })
          : await prisma.job.findFirst({ 
              where: { 
                title: job.title,
                company: job.company,
                url: job.url
              } 
            });

        if (existingJob) {
          // Update existing job
          return prisma.job.update({
            where: { id: existingJob.id },
            data: {
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              requirements: job.requirements || [],
              url: job.url,
              applyUrl: job.applyUrl,
              salary: job.salary,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              type: job.type,
              experienceLevel: job.experienceLevel,
              isRemote: job.isRemote || false,
              scrapedAt: new Date(),
              source: job.source,
              isActive: true
            }
          });
        } else {
          // Create new job
          return prisma.job.create({
            data: {
              externalId: job.externalId,
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              requirements: job.requirements || [],
              url: job.url,
              applyUrl: job.applyUrl,
              salary: job.salary,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              type: job.type,
              experienceLevel: job.experienceLevel,
              isRemote: job.isRemote || false,
              source: job.source,
              isActive: true
            }
          });
        }
      })
    );

    // Return jobs with database IDs
    const jobsWithIds = jobs.map((job, index) => ({
      ...job,
      id: savedJobs[index].id
    }));

    return NextResponse.json({ jobs: jobsWithIds });
  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search jobs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}