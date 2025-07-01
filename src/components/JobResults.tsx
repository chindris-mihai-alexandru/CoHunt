'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Building2, Calendar, Star, Bookmark } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  type?: string;
  postedDate?: string;
  source: string;
  matchScore?: number;
  matchReason?: string;
}

interface JobResultsProps {
  results: {
    jobs: Job[];
    totalFound: number;
    searchTime: number;
  };
}

export default function JobResults({ results }: JobResultsProps) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'ycombinator':
      case 'y combinator':
        return 'bg-orange-100 text-orange-800';
      case 'wellfound':
      case 'angellist':
        return 'bg-purple-100 text-purple-800';
      case 'indeed':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!results.jobs || results.jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search terms or location to find more opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.totalFound.toLocaleString()} Jobs Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Search completed in {results.searchTime}ms
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {results.jobs.length} results
            </p>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {results.jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  {job.matchScore && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% match
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.postedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(job.source)}`}>
                    {job.source}
                  </span>
                  {job.type && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                      {job.type}
                    </span>
                  )}
                  {job.salary && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                      {job.salary}
                    </span>
                  )}
                </div>

                {job.matchReason && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Why this matches:</strong> {job.matchReason}
                    </p>
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    savedJobs.includes(job.id)
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={savedJobs.includes(job.id) ? 'Remove from saved' : 'Save job'}
                >
                  <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                </button>
                
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {results.jobs.length < results.totalFound && (
        <div className="text-center">
          <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
}