import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { firecrawlJobService } from './firecrawl-service';

const prisma = new PrismaClient();

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  applyUrl?: string;
  salary?: string;
  type?: string;
  postedDate?: Date;
  source: string;
}

export class JobScraper {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeIndeed(query: string, location: string = ''): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = [];
    
    try {
      // Add delay to avoid rate limiting
      await this.delay(1000);
      
      const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
      console.log(`Scraping Indeed URL: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log(`Indeed response status: ${response.status}, content length: ${response.data.length}`);

      const $ = cheerio.load(response.data);
      
      $('.job_seen_beacon').each((_: number, element: cheerio.Element) => {
        const $el = $(element);
        
        const job: ScrapedJob = {
          title: $el.find('.jobTitle span[title]').text().trim(),
          company: $el.find('.companyName').text().trim(),
          location: $el.find('.locationsContainer').text().trim(),
          description: $el.find('.job-snippet').text().trim(),
          url: `https://www.indeed.com${$el.find('.jobTitle a').attr('href')}`,
          salary: $el.find('.salary-snippet').text().trim() || undefined,
          type: $el.find('.attribute_snippet').text().trim() || undefined,
          source: 'indeed'
        };

        if (job.title && job.company) {
          jobs.push(job);
        }
      });
    } catch (error) {
      console.error('Error scraping Indeed:', error);
      // Don't throw, just return empty array to allow other sources to continue
    }

    return jobs;
  }

  async scrapeLinkedIn(): Promise<ScrapedJob[]> {
    // LinkedIn is harder to scrape due to authentication requirements
    // For production, consider using LinkedIn API or a service like ScrapingBee
    // For now, return empty array
    return [];
  }

  async saveJobsToDatabase(jobs: ScrapedJob[]): Promise<void> {
    for (const job of jobs) {
      try {
        // Check if job already exists
        const existingJob = await prisma.job.findFirst({
          where: {
            url: job.url,
          }
        });

        if (existingJob) {
          // Update existing job
          await prisma.job.update({
            where: { id: existingJob.id },
            data: {
              isActive: true,
              scrapedAt: new Date(),
            }
          });
        } else {
          // Create new job
          await prisma.job.create({
            data: {
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              url: job.url,
              applyUrl: job.applyUrl,
              salary: job.salary,
              type: job.type,
              postedDate: job.postedDate && !isNaN(job.postedDate.getTime()) ? job.postedDate : new Date(),
              source: job.source,
            },
          });
        }
      } catch (error) {
        console.error('Error saving job:', error);
      }
    }
  }

  async scrapeAndSaveJobs(query: string, location: string = ''): Promise<number> {
    let allJobs: ScrapedJob[] = [];
    
    // Try both Firecrawl and traditional scraping for better results
    let firecrawlJobs: ScrapedJob[] = [];
    let traditionalJobs: ScrapedJob[] = [];

    try {
      // First try Firecrawl for live job search
      console.log('Attempting Firecrawl job search...');
      const firecrawlResults = await firecrawlJobService.searchJobs({
        query,
        location,
        maxResults: 10
      });
      
      // Convert Firecrawl jobs to ScrapedJob format
      firecrawlJobs = firecrawlResults.map(job => ({
        title: job.title,
        company: job.company,
        location: job.location || location || 'Remote',
        description: job.description,
        url: job.url || '',
        applyUrl: job.applyUrl,
        salary: job.salaryRange,
        type: 'Full-time', // Default type
        postedDate: new Date(),
        source: 'firecrawl'
      }));
      
      console.log(`Firecrawl found ${firecrawlJobs.length} jobs`);
      
    } catch (error) {
      console.error('Firecrawl failed:', error);
    }

    // Always try traditional scraping as backup/supplement
    try {
      console.log('Attempting traditional scraping...');
      const indeedJobs = await this.scrapeIndeed(query, location);
      const linkedInJobs = await this.scrapeLinkedIn();
      
      traditionalJobs = [...indeedJobs, ...linkedInJobs];
      console.log(`Traditional scraping found ${traditionalJobs.length} jobs`);
      
    } catch (error) {
      console.error('Traditional scraping failed:', error);
    }

    // Combine both sources, prioritizing Firecrawl
    allJobs = [...firecrawlJobs, ...traditionalJobs];
    console.log(`Total jobs found: ${allJobs.length} (${firecrawlJobs.length} from Firecrawl, ${traditionalJobs.length} from traditional)`);

    // If no jobs found, provide helpful message
    if (allJobs.length === 0) {
      console.log('No jobs found from any source');
    }
    
    // Save jobs to database
    if (allJobs.length > 0) {
      await this.saveJobsToDatabase(allJobs);
    }
    
    return allJobs.length;
  }
  
  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
} 