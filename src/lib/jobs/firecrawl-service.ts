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
      // Build search query
      let searchQuery = query;
      if (jobType) {
        searchQuery += ` ${jobType}`;
      }
      if (location) {
        searchQuery += ` in ${location}`;
      }

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

    // Patterns that indicate it's NOT a job listing
    const excludePatterns = [
      /\/search\?/i,
      /\/jobs\?/i,
      /q=/i,
      /salary/i,
      /glassdoor\.com\/Salaries/i,
      /indeed\.com\/career/i,
    ];

    for (const pattern of excludePatterns) {
      if (pattern.test(url)) return false;
    }

    // Patterns that indicate it IS a job listing
    const includePatterns = [
      /indeed\.com\/viewjob/i,
      /indeed\.com\/job\//i,
      /workatastartup\.com\/jobs\//i,
      /wellfound\.com\/.*\/jobs\//i,
      /weworkremotely\.com\/remote-jobs\//i,
      /remoteok\.io\/remote-jobs\//i,
      /\/careers?\//i,
      /\/job[s]?\//i,
      /\/position[s]?\//i,
    ];

    return includePatterns.some(pattern => pattern.test(url));
  }

  private extractJobData(result: any): JobData | null {
    try {
      const content = result.markdown || result.content || '';
      const url = result.url || '';

      // Extract company from URL or content
      let company = 'Unknown Company';
      if (url.includes('indeed.com')) {
        company = this.extractFromPattern(content, /Company:\s*([^\n]+)/i) || company;
      } else if (url.includes('workatastartup.com')) {
        const urlMatch = url.match(/workatastartup\.com\/companies\/([^\/]+)/);
        if (urlMatch) company = urlMatch[1].replace(/-/g, ' ');
      }

      // Extract job details
      const job: JobData = {
        title: result.title || this.extractFromPattern(content, /Job Title:\s*([^\n]+)/i) || 'Unknown Position',
        company: company,
        location: this.extractFromPattern(content, /Location:\s*([^\n]+)/i) || 'Not specified',
        description: this.extractDescription(content),
        url: url,
        salaryRange: this.extractFromPattern(content, /Salary:\s*([^\n]+)/i),
        postedDate: this.extractFromPattern(content, /Posted:\s*([^\n]+)/i) || 'Recently',
        requirements: this.extractRequirements(content),
        applyUrl: this.extractApplyUrl(content, url),
      };

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