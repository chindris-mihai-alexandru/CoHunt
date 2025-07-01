import { z } from 'zod';

// Define schema for job search results
export const jobSchema = z.object({
  id: z.string().optional(),
  externalId: z.string().optional(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  description: z.string(),
  requirements: z.array(z.string()).optional().default([]),
  url: z.string(),
  applyUrl: z.string().optional(),
  salary: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  type: z.string().optional(),
  experienceLevel: z.string().optional(),
  isRemote: z.boolean().optional().default(false),
  postedDate: z.string().optional(),
  source: z.string(),
  matchScore: z.number().optional(),
  matchReason: z.string().optional(),
});

export type Job = z.infer<typeof jobSchema>;

// Define schema for job search filters
export const jobSearchFiltersSchema = z.object({
  query: z.string(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  experienceLevel: z.string().optional(),
  jobType: z.string().optional(),
  salary: z.string().optional(),
  datePosted: z.string().optional(),
  limit: z.number().optional().default(20),
  sources: z.array(z.string()).optional(),
});

export type JobSearchFilters = z.infer<typeof jobSearchFiltersSchema>;

// Define schema for resume data
export const resumeSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      duration: z.string(),
      description: z.string().optional(),
    })
  ).optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      date: z.string(),
    })
  ).optional(),
});

export type Resume = z.infer<typeof resumeSchema>;

class FirecrawlService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY || '';
  }

  /**
   * Search for jobs across multiple platforms
   */
  async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Firecrawl API key not configured');
      }

      // Build the search query
      let query = filters.query;
      
      // Add location to query if provided
      if (filters.location) {
        query += ` location:"${filters.location}"`;
      }
      
      // Add remote filter if specified
      if (filters.remote) {
        query += ' remote:true';
      }

      // Add experience level if specified
      if (filters.experienceLevel) {
        query += ` level:"${filters.experienceLevel}"`;
      }

      // Add job type if specified
      if (filters.jobType) {
        query += ` type:"${filters.jobType}"`;
      }

      // Add date posted filter if specified
      if (filters.datePosted) {
        query += ` posted:${filters.datePosted}`;
      }

      // Build source filters for specific job boards
      const sourceFilters = [];
      
      // Always include major job boards
      sourceFilters.push('site:linkedin.com/jobs');
      sourceFilters.push('site:indeed.com/viewjob');
      
      // Add startup job boards
      sourceFilters.push('site:workatastartup.com');
      sourceFilters.push('site:wellfound.com/jobs');
      sourceFilters.push('site:ycombinator.com/jobs');
      
      // Add remote job boards
      sourceFilters.push('site:remoteok.com');
      sourceFilters.push('site:weworkremotely.com');
      
      // Add niche job boards if specified in sources
      if (filters.sources?.includes('github')) {
        sourceFilters.push('site:github.com/jobs');
      }
      
      if (filters.sources?.includes('stackoverflow')) {
        sourceFilters.push('site:stackoverflow.com/jobs');
      }
      
      // Combine source filters with OR
      const sourceQuery = sourceFilters.join(' OR ');
      query += ` (${sourceQuery})`;

      // Make the API request to Firecrawl
      const response = await fetch('https://api.firecrawl.dev/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query,
          limit: filters.limit || 20,
          scrape: true,
          extract: {
            schema: jobSchema.omit({ id: true, matchScore: true, matchReason: true }).partial(),
            prompt: "Extract job information from this page. Identify the job title, company, location, description, requirements, salary, job type, and application URL."
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Firecrawl API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      // Process and validate the results
      const jobs: Job[] = [];
      
      for (const result of data.results) {
        try {
          // Skip search results pages and non-job pages
          if (this.isSearchResultPage(result.url) || !this.isJobPage(result.url, result.title)) {
            continue;
          }
          
          // Extract job data
          const jobData = result.extract || {};
          
          // Parse salary range if available
          let salaryMin: number | undefined;
          let salaryMax: number | undefined;
          
          if (jobData.salary) {
            const salaryMatches = jobData.salary.match(/\$?(\d+)(?:,\d+)?(?:\s*-\s*\$?(\d+)(?:,\d+)?)?/);
            if (salaryMatches) {
              salaryMin = parseInt(salaryMatches[1].replace(/,/g, ''));
              if (salaryMatches[2]) {
                salaryMax = parseInt(salaryMatches[2].replace(/,/g, ''));
              }
            }
          }
          
          // Determine if job is remote
          const isRemote = 
            jobData.location?.toLowerCase().includes('remote') || 
            result.title?.toLowerCase().includes('remote') ||
            result.content?.toLowerCase().includes('fully remote') ||
            false;
          
          // Determine experience level
          let experienceLevel: string | undefined;
          const content = (result.content || '').toLowerCase();
          
          if (content.includes('senior') || content.includes('sr.') || content.includes('lead')) {
            experienceLevel = 'senior';
          } else if (content.includes('junior') || content.includes('jr.') || content.includes('entry')) {
            experienceLevel = 'junior';
          } else if (content.includes('mid') || content.includes('intermediate')) {
            experienceLevel = 'mid-level';
          }
          
          // Create job object
          const job: Job = {
            externalId: result.id,
            title: jobData.title || result.title || 'Unknown Position',
            company: jobData.company || 'Unknown Company',
            location: jobData.location || 'Unknown Location',
            description: jobData.description || result.content || 'No description available',
            requirements: jobData.requirements || [],
            url: result.url,
            applyUrl: jobData.applyUrl,
            salary: jobData.salary,
            salaryMin,
            salaryMax,
            type: jobData.type,
            experienceLevel,
            isRemote,
            postedDate: jobData.postedDate,
            source: this.determineSource(result.url)
          };
          
          jobs.push(job);
        } catch (error) {
          console.error('Error processing job result:', error);
          // Skip this result and continue
        }
      }
      
      return jobs;
    } catch (error) {
      console.error('Firecrawl searchJobs error:', error);
      throw error;
    }
  }

  /**
   * Scrape a specific job posting by URL
   */
  async scrapeJobPosting(url: string): Promise<Job> {
    try {
      if (!this.apiKey) {
        throw new Error('Firecrawl API key not configured');
      }

      const response = await fetch('https://api.firecrawl.dev/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          url,
          extract: {
            schema: jobSchema.omit({ id: true, matchScore: true, matchReason: true }).partial(),
            prompt: "Extract job information from this page. Identify the job title, company, location, description, requirements, salary, job type, and application URL."
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Firecrawl API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      // Extract job data
      const jobData = data.extract || {};
      
      // Parse salary range if available
      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      
      if (jobData.salary) {
        const salaryMatches = jobData.salary.match(/\$?(\d+)(?:,\d+)?(?:\s*-\s*\$?(\d+)(?:,\d+)?)?/);
        if (salaryMatches) {
          salaryMin = parseInt(salaryMatches[1].replace(/,/g, ''));
          if (salaryMatches[2]) {
            salaryMax = parseInt(salaryMatches[2].replace(/,/g, ''));
          }
        }
      }
      
      // Determine if job is remote
      const isRemote = 
        jobData.location?.toLowerCase().includes('remote') || 
        data.title?.toLowerCase().includes('remote') ||
        data.content?.toLowerCase().includes('fully remote') ||
        false;
      
      // Create job object
      const job: Job = {
        externalId: data.id,
        title: jobData.title || data.title || 'Unknown Position',
        company: jobData.company || 'Unknown Company',
        location: jobData.location || 'Unknown Location',
        description: jobData.description || data.content || 'No description available',
        requirements: jobData.requirements || [],
        url: data.url || url,
        applyUrl: jobData.applyUrl,
        salary: jobData.salary,
        salaryMin,
        salaryMax,
        type: jobData.type,
        experienceLevel: jobData.experienceLevel,
        isRemote,
        postedDate: jobData.postedDate,
        source: this.determineSource(url)
      };
      
      return job;
    } catch (error) {
      console.error('Firecrawl scrapeJobPosting error:', error);
      throw error;
    }
  }

  /**
   * Extract resume data from a URL (e.g., LinkedIn profile)
   */
  async extractResumeFromUrl(url: string): Promise<Resume> {
    try {
      if (!this.apiKey) {
        throw new Error('Firecrawl API key not configured');
      }

      const response = await fetch('https://api.firecrawl.dev/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          url,
          extract: {
            schema: resumeSchema,
            prompt: "Extract professional information from this profile page. Identify the person's name, title, summary, skills, experience, and education."
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Firecrawl API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      // Extract resume data
      const resumeData = data.extract || {};
      
      // Create resume object
      const resume: Resume = {
        name: resumeData.name,
        title: resumeData.title,
        summary: resumeData.summary,
        skills: resumeData.skills || [],
        experience: resumeData.experience || [],
        education: resumeData.education || []
      };
      
      return resume;
    } catch (error) {
      console.error('Firecrawl extractResumeFromUrl error:', error);
      throw error;
    }
  }

  /**
   * Determine the source of a job posting based on URL
   */
  private determineSource(url: string): string {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('indeed.com')) return 'indeed';
    if (url.includes('workatastartup.com')) return 'ycombinator';
    if (url.includes('wellfound.com') || url.includes('angel.co')) return 'wellfound';
    if (url.includes('remoteok.com')) return 'remoteok';
    if (url.includes('weworkremotely.com')) return 'weworkremotely';
    if (url.includes('github.com')) return 'github';
    if (url.includes('stackoverflow.com')) return 'stackoverflow';
    return 'other';
  }

  /**
   * Check if a URL is a search results page
   */
  private isSearchResultPage(url: string): boolean {
    return url.includes('/search') || 
           url.includes('?q=') || 
           url.includes('&q=') || 
           url.includes('/jobs?') ||
           url.includes('/find-jobs');
  }

  /**
   * Check if a URL is a job posting page
   */
  private isJobPage(url: string, title?: string): boolean {
    // Check URL patterns for job pages
    const jobUrlPatterns = [
      /\/job\//i,
      /\/jobs\/[a-z0-9-]+/i,
      /\/viewjob/i,
      /\/company\/[^\/]+\/jobs\//i,
      /careers?\//i
    ];
    
    if (jobUrlPatterns.some(pattern => pattern.test(url))) {
      return true;
    }
    
    // Check title patterns for job pages
    if (title) {
      const jobTitlePatterns = [
        /hiring/i,
        /job/i,
        /career/i,
        /position/i,
        /opening/i
      ];
      
      if (jobTitlePatterns.some(pattern => pattern.test(title))) {
        return true;
      }
    }
    
    return false;
  }
}

export const firecrawlService = new FirecrawlService();