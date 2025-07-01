'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar,
  Filter,
  Bookmark,
  ExternalLink,
  Building2,
  DollarSign,
  Clock,
  Star,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Job } from '@/lib/jobs/firecrawl-service';

interface JobSearchClientProps {
  initialJobs?: Job[];
}

export default function JobSearchClient({ initialJobs = [] }: JobSearchClientProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [remoteFilter, setRemoteFilter] = useState<boolean | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    // Load saved jobs
    const loadSavedJobs = async () => {
      try {
        const response = await fetch('/api/jobs/saved');
        if (response.ok) {
          const data = await response.json();
          setSavedJobs(data.savedJobs.map((job: any) => job.jobId));
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };

    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          location: locationFilter || undefined,
          remote: remoteFilter,
          experienceLevel: experienceFilter !== 'all' ? experienceFilter : undefined,
          jobType: typeFilter !== 'all' ? typeFilter : undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }
      
      const data = await response.json();
      setJobs(data.jobs);
      
      if (data.jobs.length === 0) {
        toast.info('No jobs found matching your criteria');
      } else {
        toast.success(`Found ${data.jobs.length} jobs`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Unsave job
        const response = await fetch(`/api/jobs/save?jobId=${jobId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSavedJobs(savedJobs.filter(id => id !== jobId));
          toast.success('Job removed from saved jobs');
        } else {
          throw new Error('Failed to unsave job');
        }
      } else {
        // Save job
        const response = await fetch('/api/jobs/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jobId })
        });
        
        if (response.ok) {
          setSavedJobs([...savedJobs, jobId]);
          toast.success('Job saved successfully');
        } else {
          throw new Error('Failed to save job');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast.error('Failed to update saved jobs');
    }
  };

  const applyToJob = async (job: Job) => {
    // In a real app, this would open the application form or redirect to the job site
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    } else if (job.url) {
      window.open(job.url, '_blank');
    } else {
      toast.error('No application URL available');
    }
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Jobs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="junior">Junior</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remote Options
                </label>
                <select
                  value={remoteFilter === undefined ? 'all' : remoteFilter ? 'remote' : 'onsite'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRemoteFilter(value === 'all' ? undefined : value === 'remote');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Options</option>
                  <option value="remote">Remote Only</option>
                  <option value="onsite">On-site Only</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters to find more opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id || job.url} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.matchScore && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% match
                    </span>
                  )}
                  <button
                    onClick={() => job.id && toggleSaveJob(job.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      job.id && savedJobs.includes(job.id)
                        ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${job.id && savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                {job.type && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.postedDate && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedDate}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className={`text-gray-600 dark:text-gray-400 ${expandedJob === (job.id || job.url) ? '' : 'line-clamp-2'}`}>
                  {job.description}
                </p>
                {job.description && job.description.length > 150 && (
                  <button
                    onClick={() => toggleJobExpansion(job.id || job.url)}
                    className="text-blue-600 hover:underline text-sm mt-1"
                  >
                    {expandedJob === (job.id || job.url) ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded text-sm">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Match Reason */}
              {job.matchReason && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Why this matches:</span> {job.matchReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => applyToJob(job)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}