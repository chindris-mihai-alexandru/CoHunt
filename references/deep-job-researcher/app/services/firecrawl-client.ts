import { z } from "zod";
import { ProgressCallback } from "./api";

// Re-export schemas from the original firecrawl service
export { resumeSchema, jobSchema, type ResumeData, type JobData, type JobSearchFilters } from "./firecrawl";

class FirecrawlClientService {
  // Server-side API endpoints
  private readonly API_BASE = "/api/firecrawl";

  // Extract resume/portfolio data using server-side API
  async extractProfile(url: string): Promise<any> {
    try {
      console.log(`Extracting profile from URL via server API: ${url}`);

      const response = await fetch(`${this.API_BASE}?action=extractProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to extract profile: ${response.status}`);
      }

      const { profile } = await response.json();
      return profile;
    } catch (error) {
      console.error("Error extracting profile:", error);
      throw error;
    }
  }

  // Find job listings using server-side API
  async findJobMatches(
    profileData: any,
    maxResults = 10,
    updateProgress: ProgressCallback = () => {},
    filters?: any,
  ): Promise<{ jobs: any[]; analysis: string }> {
    try {
      updateProgress("Searching for job matches via secure API...");

      const response = await fetch(`${this.API_BASE}?action=findJobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
          maxResults,
          filters,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to find jobs: ${response.status}`);
      }

      const { jobs, analysis } = await response.json();
      updateProgress(`Found ${jobs.length} job matches`);

      return { jobs, analysis };
    } catch (error) {
      console.error("Error finding job matches:", error);
      throw error;
    }
  }

  // Process resume file (using existing client-side implementation for now)
  async processResumeFile(file: File): Promise<any> {
    // This still needs to be handled client-side for file processing
    // But the actual Firecrawl API calls will go through the server
    
    // For now, we'll use the OpenAI assistant API endpoint
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to process resume: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to match the expected format
    return {
      name: data.name || "",
      title: data.title || "",
      summary: data.summary_text || "",
      skills: data.skills || [],
      experience: data.job_profiles?.map((job: any) => ({
        company: job.company,
        position: job.title,
        duration: `${job.start_date} - ${job.end_date}`,
        description: job.description,
      })) || [],
      education: data.education || [],
      projects: data.projects || [],
      contact: data.contact || {},
    };
  }

  // Debug function (not needed for server-side implementation)
  async debugPdfJs(): Promise<string> {
    return "PDF.js debugging not required for server-side implementation";
  }
}

// Export a singleton instance
export const firecrawlService = new FirecrawlClientService();