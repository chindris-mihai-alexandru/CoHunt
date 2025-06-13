import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

// Define schema for job search results
export const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  description: z.string(),
  requirements: z.array(z.string()).optional(),
  url: z.string().optional(),
  salaryRange: z.string().optional(),
  postedDate: z.string().optional(),
  applyUrl: z.string().optional(),
});

export type JobData = z.infer<typeof jobSchema>;

interface JobSearchOptions {
  query: string;
  location?: string;
  jobType?: string;
  maxResults?: number;
}

class FirecrawlJobService {
  private apiKey: string;
  private client: FirecrawlApp;

  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Firecrawl API key not configured');
    }
    this.client = new FirecrawlApp({ apiKey: this.apiKey });
  }

  async searchJobs(options: JobSearchOptions): Promise<JobData[]> {
    if (!this.apiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    const { query, location, jobType, maxResults = 20 } = options;

    try {
      // Build search query - be more specific to get better results
      let searchQuery = `${query} jobs`;
      if (jobType) {
        searchQuery += ` ${jobType}`;
      }
      if (location) {
        searchQuery += ` in ${location}`;
      }
      // Add site filters to get better job results
      searchQuery += ' site:indeed.com OR site:linkedin.com OR site:glassdoor.com OR site:wellfound.com';

      console.log(`Starting Firecrawl job search for: "${searchQuery}"`);

      // Use Firecrawl search with timeout and error handling
      const searchResults = await Promise.race([
        this.client.search(searchQuery, {
          limit: Math.min(maxResults, 15), // Limit to reduce API cost
          scrapeOptions: {
            formats: ['markdown'],
            waitFor: 2000, // Wait 2 seconds for page load
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firecrawl search timeout')), 30000)
        )
      ]) as any;

      if (!searchResults.success) {
        const errorMsg = searchResults.error || 'Unknown Firecrawl error';
        console.error('Firecrawl search failed:', errorMsg);
        
        if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
          throw new Error('Firecrawl rate limit exceeded. Please try again later.');
        }
        
        throw new Error(`Firecrawl search failed: ${errorMsg}`);
      }

      if (!searchResults.data || searchResults.data.length === 0) {
        console.log('No search results from Firecrawl');
        return [];
      }

      // Process and filter results
      const jobs: JobData[] = [];
      
      for (const result of searchResults.data) {
        try {
          // Skip non-job URLs
          if (!this.isJobListingUrl(result.url)) {
            continue;
          }

          // Extract job data from the content
          const job = this.extractJobData(result);
          if (job && job.title && job.company && job.title !== 'Unknown Position') {
            jobs.push(job);
          }
        } catch (extractError) {
          console.error('Error extracting job data from result:', extractError);
          // Continue processing other results
        }
      }

      console.log(`Successfully extracted ${jobs.length} job listings from ${searchResults.data.length} results`);
      return jobs;

    } catch (error) {
      console.error('Firecrawl job search error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error('Job search timeout. Please try a more specific query.');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Too many search requests. Please wait a moment before trying again.');
        }
        if (error.message.includes('API key')) {
          throw new Error('Job search service configuration error.');
        }
      }
      
      throw new Error(`Job search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isJobListingUrl(url: string): boolean {
    if (!url) return false;

    // Be more permissive - only exclude obvious non-job pages
    const excludePatterns = [
      /glassdoor\.com\/Salaries/i,
      /indeed\.com\/career-advice/i,
      /indeed\.com\/hire/i,
      /\/privacy/i,
      /\/terms/i,
      /\/about/i,
      /\/contact/i,
    ];

    for (const pattern of excludePatterns) {
      if (pattern.test(url)) return false;
    }

    // Accept most job-related URLs
    const includePatterns = [
      /job/i,
      /career/i,
      /position/i,
      /hiring/i,
      /work/i,
      /employment/i,
      /vacancy/i,
      /opportunity/i,
    ];

    return includePatterns.some(pattern => pattern.test(url));
  }

  private extractJobData(result: any): JobData | null {
    try {
      const content = result.markdown || result.content || '';
      const url = result.url || '';
      let title = result.title || '';

      // Skip if this is a job listing page, not a specific job
      if (title.includes('Jobs, Employment') || title.includes('job openings') || title.includes('careers')) {
        // Try to extract individual job from content if it's a listing page
        const jobMatch = content.match(/##?\s*\[?([^\\[\]]+?)\]?\s*(?:at|@|-)\s*([^\\n]+)/);
        if (!jobMatch) return null;
        title = jobMatch[1].trim();
      }

      // Extract company from various patterns
      let company = 'Unknown Company';
      if (url.includes('indeed.com')) {
        company = this.extractFromPattern(content, /Company:\s*([^\n]+)/i) || 
                 this.extractFromPattern(content, /^([^\\n]+)\s*\d+\.\d+/m) || // Rating pattern
                 company;
      } else if (url.includes('linkedin.com')) {
        company = this.extractFromPattern(content, /About the company\s*([^\n]+)/i) || company;
      } else if (url.includes('glassdoor.com')) {
        company = this.extractFromPattern(content, /Company\s*-\s*([^\n]+)/i) || company;
      }

      // Better location extraction
      const location = this.extractFromPattern(content, /Location:\s*([^\n]+)/i) || 
                      this.extractFromPattern(content, /📍\s*([^\n]+)/i) ||
                      this.extractFromPattern(content, /\b(?:Remote|Hybrid|On-site)\s+(?:in\s+)?([^\n]+)/i) ||
                      'Not specified';

      // Extract job details
      const job: JobData = {
        title: title.replace(/\s*\|.*$/, '').trim(), // Remove trailing info
        company: company,
        location: location,
        description: this.extractDescription(content),
        url: url,
        salaryRange: this.extractSalary(content),
        postedDate: this.extractFromPattern(content, /Posted:\s*([^\n]+)/i) || 'Recently',
        requirements: this.extractRequirements(content),
        applyUrl: this.extractApplyUrl(content, url),
      };

      // Validate the job data
      if (job.title === 'Unknown Position' || job.title.length < 5) {
        return null;
      }

      return job;
    } catch (error) {
      console.error('Error extracting job data:', error);
      return null;
    }
  }

  private extractFromPattern(content: string, pattern: RegExp): string | undefined {
    const match = content.match(pattern);
    return match ? match[1].trim() : undefined;
  }

  private extractSalary(content: string): string | undefined {
    // Common salary patterns
    const patterns = [
      /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|hour|month))?/i,
      /€[\d,]+(?:\s*-\s*€[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|hour|month))?/i,
      /£[\d,]+(?:\s*-\s*£[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|hour|month))?/i,
      /Salary:\s*([^\n]+)/i,
      /Compensation:\s*([^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    return undefined;
  }

  private extractDescription(content: string): string {
    // Try to extract job description section
    const descPatterns = [
      /Description[:\s]*([^#]+?)(?=Requirements|Qualifications|About|$)/is,
      /About the role[:\s]*([^#]+?)(?=Requirements|Qualifications|What|$)/is,
      /Job Summary[:\s]*([^#]+?)(?=Requirements|Qualifications|About|$)/is,
    ];

    for (const pattern of descPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1].trim().substring(0, 500) + '...';
      }
    }

    // Fallback: take first 500 chars
    return content.substring(0, 500).trim() + '...';
  }

  private extractRequirements(content: string): string[] {
    const requirements: string[] = [];
    
    // Try to find requirements section
    const reqPatterns = [
      /Requirements[:\s]*([^#]+?)(?=Responsibilities|About|Benefits|$)/is,
      /Qualifications[:\s]*([^#]+?)(?=Responsibilities|About|Benefits|$)/is,
      /What we're looking for[:\s]*([^#]+?)(?=What we offer|About|Benefits|$)/is,
    ];

    for (const pattern of reqPatterns) {
      const match = content.match(pattern);
      if (match) {
        // Extract bullet points
        const bullets = match[1].match(/[•\-\*]\s*([^\n•\-\*]+)/g);
        if (bullets) {
          bullets.forEach(bullet => {
            const cleaned = bullet.replace(/[•\-\*]\s*/, '').trim();
            if (cleaned.length > 10) {
              requirements.push(cleaned);
            }
          });
        }
        break;
      }
    }

    return requirements.slice(0, 5); // Return top 5 requirements
  }

  private extractApplyUrl(content: string, pageUrl: string): string | undefined {
    // Look for apply button/link in content
    const applyPatterns = [
      /Apply Now.*?href="([^"]+)"/i,
      /Apply for this job.*?href="([^"]+)"/i,
      /href="([^"]+)"[^>]*>Apply/i,
    ];

    for (const pattern of applyPatterns) {
      const match = content.match(pattern);
      if (match) {
        const applyUrl = match[1];
        // Make sure it's a full URL
        if (applyUrl.startsWith('http')) {
          return applyUrl;
        } else if (applyUrl.startsWith('/')) {
          const baseUrl = new URL(pageUrl).origin;
          return baseUrl + applyUrl;
        }
      }
    }

    // Default to the page URL
    return pageUrl;
  }
}

export const firecrawlJobService = new FirecrawlJobService();