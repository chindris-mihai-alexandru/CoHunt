'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface SearchHistory {
  id: string;
  query: string;
  location?: string;
  resultsCount: number;
  createdAt: string;
}

interface DashboardStats {
  totalSearches: number;
  savedJobs: number;
  applications: number;
  recentSearches: SearchHistory[];
}

export default function Dashboard() {
  const { user, isPremium, searchesRemaining } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSearches: 0,
    savedJobs: 0,
    applications: 0,
    recentSearches: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    const supabase = createClient();
    
    try {
      // Fetch user statistics
      const [searchesResult, savedJobsResult, applicationsResult, recentSearchesResult] = await Promise.all([
        supabase.from('searches').select('*', { count: 'exact' }).eq('userId', user!.id),
        supabase.from('saved_jobs').select('*', { count: 'exact' }).eq('userId', user!.id),
        supabase.from('applications').select('*', { count: 'exact' }).eq('userId', user!.id),
        supabase.from('search_history').select('*').eq('userId', user!.id).order('createdAt', { ascending: false }).limit(5)
      ]);

      setStats({
        totalSearches: searchesResult.count || 0,
        savedJobs: savedJobsResult.count || 0,
        applications: applicationsResult.count || 0,
        recentSearches: recentSearchesResult.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isPremium ? 'Premium Member' : 'Free Plan'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isPremium 
                  ? 'Unlimited searches and premium features' 
                  : `${searchesRemaining} searches remaining today`}
              </p>
            </div>
            {!isPremium && (
              <Link
                href="/pricing"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
              >
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Searches</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalSearches}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Jobs</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.savedJobs}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Applications</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.applications}</p>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Searches</h3>
          {stats.recentSearches.length > 0 ? (
            <div className="space-y-3">
              {stats.recentSearches.map((search: SearchHistory) => (
                <div key={search.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{search.query}</p>
                    <p className="text-sm text-gray-500">{search.location || 'Any location'} • {search.resultsCount} results</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(search.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent searches</p>
          )}
        </div>
      </div>
    </div>
  );
} 