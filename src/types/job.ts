export interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  applyUrl?: string;
  salary?: string;
  type: string;
  matchScore?: number;
  jobId?: string;
  postedDate?: string;
}

export interface SearchJobsRequest {
  query: string;
  location?: string;
  jobType?: string;
}

export interface SearchJobsResponse {
  jobs: Job[];
}