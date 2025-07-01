'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import JobSearchForm from '@/components/JobSearchForm';
import JobResults from '@/components/JobResults';
import Link from 'next/link';
import { Search, Users, Mail, BarChart3, Target, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { user, signOut } = useAuth();

  const handleJobSearch = async (searchData: any) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EmailVerificationBanner />
      
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CoHunt</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Job Search</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Pricing</a>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    Get Started Free
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Find Your Dream
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Job</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered job search that matches you with opportunities from top companies, startups, and the hidden job market.
            </p>
            
            {/* Job Search Form */}
            <div className="max-w-2xl mx-auto mb-12">
              <JobSearchForm onSearch={handleJobSearch} isLoading={isSearching} />
            </div>

            {/* Search Results */}
            {searchResults && (
              <div className="mt-12">
                <JobResults results={searchResults} />
              </div>
            )}

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400 mb-16">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">10k+ Jobs Found Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">500+ Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">95% Match Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Job Search Features
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From AI matching to startup job boards, we cover every corner of the job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* AI Matching */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Matching</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Advanced algorithms analyze your skills and preferences to find perfect job matches with detailed scoring.</p>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>Smart + Automated + Precise</span>
              </div>
            </div>

            {/* Startup Jobs */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Startup Job Boards</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Access Y Combinator jobs, WellFound (AngelList), and other exclusive startup opportunities.</p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <span>YC + AngelList + More</span>
              </div>
            </div>

            {/* Hidden Job Market */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Hidden Job Market</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Discover unadvertised positions through company research and network analysis.</p>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <span>Exclusive + Unadvertised</span>
              </div>
            </div>

            {/* Real-time Search */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real-time Job Search</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Live scraping of job boards ensures you see the latest opportunities as they're posted.</p>
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <span>Powered by Firecrawl</span>
              </div>
            </div>

            {/* Resume Analysis */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Resume Analysis</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Upload your resume for personalized job matching and skill gap analysis.</p>
              <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                <span>AI-Powered Analysis</span>
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Job Alerts</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get notified instantly when new jobs match your criteria across all platforms.</p>
              <div className="flex items-center text-sm text-pink-600 dark:text-pink-400">
                <span>Real-time Notifications</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How CoHunt Works
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to find your perfect job match
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Search & Upload</h4>
              <p className="text-gray-600 dark:text-gray-300">Enter your job preferences and optionally upload your resume for better matching.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Analysis</h4>
              <p className="text-gray-600 dark:text-gray-300">Our AI scans thousands of job boards, including startups and hidden opportunities.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get Matched</h4>
              <p className="text-gray-600 dark:text-gray-300">Receive ranked job matches with detailed explanations and application links.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Find Your Dream Job?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of job seekers who've found their perfect match with CoHunt's AI-powered search.
            </p>
            <button
              onClick={() => setShowSignupModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Job Search
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Free to use • No credit card required • Instant results
            </p>
          </div>
        </section>
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