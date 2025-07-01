'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Bookmark, 
  ExternalLink,
  Building2,
  Target,
  FileText,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface JobDetailClientProps {
  job: any; // Using any for simplicity, would use a proper type in a real app
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchReason, setMatchReason] = useState<string | null>(null);
  const [keySkillMatches, setKeySkillMatches] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if job is saved
    const checkSavedStatus = async () => {
      try {
        const response = await fetch('/api/jobs/saved');
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.savedJobs.some((savedJob: any) => savedJob.jobId === job.id));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    // Calculate match score
    const calculateMatchScore = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/jobs/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jobId: job.id })
        });
        
        if (response.ok) {
          const data = await response.json();
          setMatchScore(data.job.matchScore);
          setMatchReason(data.job.matchReason);
          setKeySkillMatches(data.job.keySkillMatches || []);
          setMissingSkills(data.job.missingSkills || []);
          setImprovementSuggestions(data.job.improvementSuggestions || []);
        }
      } catch (error) {
        console.error('Error calculating match score:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkSavedStatus();
      calculateMatchScore();
    }
  }, [user, job.id]);

  const toggleSaveJob = async () => {
    try {
      if (isSaved) {
        // Unsave job
        const response = await fetch(`/api/jobs/save?jobId=${job.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setIsSaved(false);
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
          body: JSON.stringify({ jobId: job.id })
        });
        
        if (response.ok) {
          setIsSaved(true);
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

  const applyToJob = async () => {
    // In a real app, this would open the application form or redirect to the job site
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    } else if (job.url) {
      window.open(job.url, '_blank');
    } else {
      toast.error('No application URL available');
    }
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {job.company.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSaveJob}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                title={isSaved ? 'Unsave job' : 'Save job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareJob}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Share job"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
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

          <div className="flex items-center gap-3">
            <button 
              onClick={applyToJob}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Now
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Original
            </a>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
          <div className="prose prose-blue max-w-none dark:prose-invert">
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {job.description}
            </div>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {job.requirements.map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Company Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About {job.company}</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">
                {job.company.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{job.company}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.location}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {/* This would be company description in a real app */}
            Information about {job.company} would be displayed here. This could include company size, industry, founding date, and a brief description of what they do.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Match Score */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Match Analysis
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : matchScore ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Match Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(matchScore)}`}>
                    {matchScore}%
                  </span>
                </div>
                
                {matchReason && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {matchReason}
                    </p>
                  </div>
                )}
                
                {keySkillMatches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Your Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {keySkillMatches.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills to Develop</h3>
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {improvementSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Suggestions</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pl-5 list-disc">
                      {improvementSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Upload your resume to see how well you match this job.
                </p>
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Upload Resume
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Similar Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Similar Jobs</h2>
          <div className="space-y-4">
            {/* This would be populated with actual similar jobs in a real app */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">
                    {String.fromCharCode(64 + i)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Similar {job.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Company {i} • Location {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Tips</h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
              </div>
              <span>Tailor your resume to highlight relevant skills for this position</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
              </div>
              <span>Research {job.company} before your interview</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
              </div>
              <span>Prepare examples that demonstrate your experience with {job.requirements?.[0] || 'required skills'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}