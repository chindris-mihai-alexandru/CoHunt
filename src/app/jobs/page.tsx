'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar,
  Filter,
  Heart,
  ExternalLink,
  Building2,
  DollarSign,
  Clock,
  Star,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  matchScore: number;
  isRemote: boolean;
  experienceLevel: string;
  companyLogo?: string;
  saved: boolean;
}

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading job data
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$140,000 - $180,000',
          description: 'We are looking for a Senior Frontend Developer to join our team and help build the next generation of our platform using React, TypeScript, and modern web technologies.',
          requirements: ['5+ years React experience', 'TypeScript proficiency', 'Modern CSS frameworks', 'Testing experience'],
          postedDate: '2 days ago',
          matchScore: 95,
          isRemote: false,
          experienceLevel: 'Senior',
          saved: false
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120,000 - $160,000',
          description: 'Join our fast-growing startup as a Full Stack Engineer. You\'ll work on both frontend and backend systems, building features that directly impact our users.',
          requirements: ['Node.js experience', 'React/Vue.js', 'Database design', 'API development'],
          postedDate: '1 day ago',
          matchScore: 88,
          isRemote: true,
          experienceLevel: 'Mid-level',
          saved: true
        },
        {
          id: '3',
          title: 'React Developer',
          company: 'InnovateCo',
          location: 'New York, NY',
          type: 'Contract',
          salary: '$80 - $100/hour',
          description: 'We need a skilled React Developer for a 6-month contract to help build our new customer portal. Great opportunity to work with cutting-edge technologies.',
          requirements: ['3+ years React', 'Redux/Context API', 'REST APIs', 'Responsive design'],
          postedDate: '3 days ago',
          matchScore: 82,
          isRemote: false,
          experienceLevel: 'Mid-level',
          saved: false
        },
        {
          id: '4',
          title: 'Frontend Engineer',
          company: 'DesignStudio',
          location: 'Austin, TX',
          type: 'Full-time',
          salary: '$100,000 - $130,000',
          description: 'Looking for a creative Frontend Engineer to join our design-focused team. You\'ll work closely with designers to create beautiful, interactive user experiences.',
          requirements: ['Strong CSS skills', 'JavaScript/TypeScript', 'Design systems', 'Animation libraries'],
          postedDate: '5 days ago',
          matchScore: 76,
          isRemote: false,
          experienceLevel: 'Mid-level',
          saved: false
        },
        {
          id: '5',
          title: 'Junior Web Developer',
          company: 'WebAgency',
          location: 'Remote',
          type: 'Full-time',
          salary: '$60,000 - $80,000',
          description: 'Great opportunity for a Junior Web Developer to grow their skills in a supportive environment. You\'ll work on various client projects and learn from senior developers.',
          requirements: ['HTML/CSS/JavaScript', 'Basic React knowledge', 'Git version control', 'Eagerness to learn'],
          postedDate: '1 week ago',
          matchScore: 70,
          isRemote: true,
          experienceLevel: 'Junior',
          saved: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const newSavedState = !job.saved;
        toast.success(newSavedState ? 'Job saved!' : 'Job removed from saved');
        return { ...job, saved: newSavedState };
      }
      return job;
    }));
  };

  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Location filter
    if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && job.type.toLowerCase() !== typeFilter) {
      return false;
    }

    // Experience filter
    if (experienceFilter !== 'all' && job.experienceLevel.toLowerCase() !== experienceFilter) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Jobs</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover opportunities that match your skills and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredJobs.length} jobs found
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            </div>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% match
                    </span>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.saved
                          ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedDate}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Requirements */}
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

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}