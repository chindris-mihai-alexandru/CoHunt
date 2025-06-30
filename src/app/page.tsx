'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import Link from 'next/link';
import { Search, Users, Mail, BarChart3, Target, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, signOut } = useAuth();

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
                <p className="text-xs text-gray-500 dark:text-gray-400">Inbound Recruiter Platform</p>
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
              Stop Chasing
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Candidates</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Make top talent come to you with AI-powered inbound recruiting. Build your profile, get discovered, and close deals faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowSignupModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Building Your Profile
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg transition-all duration-200">
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400 mb-16">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">500+ Active Recruiters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">10k+ Candidates Matched</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">95% Response Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Scale Your Recruiting
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From profile building to automated outreach, we've got your entire inbound recruiting workflow covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Email Finder */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email Finder & Verification</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Find and verify candidate emails using Apollo.io and Hunter.io APIs. Never send to invalid addresses again.</p>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>Powered by Apollo.io + Hunter.io</span>
              </div>
            </div>

            {/* Profile Builder */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Recruiter Profile Builder</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Showcase your expertise, track record, and specializations. Make candidates want to work with you.</p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <span>Portfolio + Skills + Experience</span>
              </div>
            </div>

            {/* Smart Matching */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Matching</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Our algorithm connects you with candidates who match your expertise and open positions.</p>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <span>Smart + Automated + Precise</span>
              </div>
            </div>

            {/* Email Automation */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Automated Email Sequences</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Set up personalized email campaigns that nurture leads and convert candidates automatically.</p>
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <span>Powered by Resend</span>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Analytics Dashboard</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Track open rates, response rates, and conversion metrics. Optimize your outreach strategy with data.</p>
              <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                <span>Real-time Insights</span>
              </div>
            </div>

            {/* Discovery Feed */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Recruiter Discovery</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get discovered by top candidates browsing our recruiter marketplace. Increase your visibility.</p>
              <div className="flex items-center text-sm text-pink-600 dark:text-pink-400">
                <span>Marketplace + Visibility</span>
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
              Three simple steps to transform your recruiting from outbound to inbound
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Build Your Profile</h4>
              <p className="text-gray-600 dark:text-gray-300">Showcase your expertise, track record, and the types of roles you specialize in recruiting for.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get Matched</h4>
              <p className="text-gray-600 dark:text-gray-300">Our AI connects you with candidates who are actively looking and match your specialization.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Close Deals</h4>
              <p className="text-gray-600 dark:text-gray-300">Use automated email sequences and analytics to nurture leads and close more placements.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Recruiting?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join hundreds of recruiters who've switched from outbound to inbound and 3x'd their placement rates.
            </p>
            <button
              onClick={() => setShowSignupModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Free Trial
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
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