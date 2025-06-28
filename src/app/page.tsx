'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  const { user, signOut, searchesRemaining, isPremium } = useAuth();

  // Check if user has resume uploaded
  useEffect(() => {
    if (user) {
      // Check if user has resume in their profile
      checkUserResume();
    }
  }, [user]);

  const checkUserResume = async () => {
    // This will be handled by the auth context
    // For now, we'll use the resumeUploaded state
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error('Please sign in to upload your resume');
      setShowLoginModal(true);
      return;
    }

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        setResumeUploaded(true);
        toast.success('Resume uploaded successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Check if user has searches remaining (for non-premium users)
    if (user && !isPremium && searchesRemaining <= 0) {
      toast.error('Daily search limit reached. Upgrade to premium for unlimited searches.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location: location,
          jobType: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        console.log('Number of jobs returned:', data.jobs?.length || 0);
        setJobs(data.jobs);
        setHasSearched(true);
        
        // Note: refreshUserData will be called from the component context
      } else {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error(errorData.error);
        } else {
          toast.error(errorData.error || 'Failed to search jobs');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search jobs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Email Verification Banner */}
      <EmailVerificationBanner />
      
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CoHunt</h1>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">About</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Pricing</a>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-4">
                    {!isPremium && (
                      <span className="text-sm text-gray-500">
                        {searchesRemaining} searches left today
                      </span>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Job Match</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered job search platform that matches you with opportunities using the latest models from OpenAI, Anthropic, and Google.
          </p>
          
          {/* Resume Upload Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Your Resume for Better Matches
              </h3>
              {!resumeUploaded ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={isUploadingResume}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isUploadingResume ? 'Uploading...' : 'PDF or text files only'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span>
                  <span>Resume uploaded! You&apos;ll now see match scores for jobs.</span>
                  <button 
                    onClick={async () => {
                      setResumeUploaded(false);
                      // Clear resume from user profile
                      if (user) {
                        try {
                          const response = await fetch('/api/clear-resume', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          });
                          if (response.ok) {
                            toast.success('Resume cleared');
                          }
                        } catch (error) {
                          console.error('Error clearing resume:', error);
                        }
                      }
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    Upload different resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="sm:w-48 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>

          {/* Job Results */}
          {hasSearched && (
            <div className="max-w-4xl mx-auto mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {jobs.length > 0 ? `Found ${jobs.length} jobs` : 'No jobs found'}
              </h3>
              
              {jobs.length > 0 && (
                <div className="grid gap-6">
                  {jobs.map((job, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h4>
                            {job.jobId && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                {job.jobId}
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                            {job.company}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span>📍 {job.location}</span>
                            <span>• {job.type}</span>
                            {job.postedDate && <span>• Posted {job.postedDate}</span>}
                          </div>
                          {job.salary && (
                            <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                              💰 {job.salary}
                            </p>
                          )}
                        </div>
                        {job.matchScore && (
                          <div className="ml-4 text-center">
                            <div className={`text-2xl font-bold ${
                              job.matchScore >= 80 ? 'text-green-600' : 
                              job.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {job.matchScore}%
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Match</p>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 items-center">
                        <button 
                          onClick={() => window.open(job.url, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Quick Apply (Email)
                        </button>
                        {job.applyUrl && (
                          <button 
                            onClick={() => window.open(job.applyUrl, '_blank')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Apply on Company Site
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Save Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feature Cards */}
          {!hasSearched && (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-blue-600 dark:text-blue-400 text-xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600 dark:text-gray-300">Advanced AI models analyze your profile and match you with the most relevant opportunities.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-green-600 dark:text-green-400 text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Jobs</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get instant access to the latest job openings from top companies worldwide.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">Track your applications and get insights to improve your job search strategy.</p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Ready to revolutionize your job search?</p>
                <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200">
                  Get Started Free
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}