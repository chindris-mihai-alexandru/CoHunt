'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Mail, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  ArrowUpRight,
  Plus
} from 'lucide-react';

interface DashboardStats {
  profileViews: number;
  emailsSent: number;
  responseRate: number;
  activeMatches: number;
  placementsMade: number;
  revenue: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    emailsSent: 0,
    responseRate: 0,
    activeMatches: 0,
    placementsMade: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        profileViews: 1247,
        emailsSent: 89,
        responseRate: 68,
        activeMatches: 23,
        placementsMade: 12,
        revenue: 180000
      });
      setLoading(false);
    }, 1000);
  }, []);

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href="/campaigns"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Campaigns
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/profile"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete Profile</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/campaigns/new"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New Campaign</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Create</p>
                </div>
                <Plus className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/matches"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New Matches</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeMatches}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/analytics"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analytics</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">View</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Views</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.profileViews.toLocaleString()}</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emails Sent</h3>
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.emailsSent}</p>
            <p className="text-sm text-blue-600">This month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response Rate</h3>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.responseRate}%</p>
            <p className="text-sm text-purple-600">Above industry avg</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Matches</h3>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.activeMatches}</p>
            <p className="text-sm text-orange-600">Ready to contact</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Placements</h3>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.placementsMade}</p>
            <p className="text-sm text-yellow-600">This year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">${stats.revenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">YTD earnings</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Matches</h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Chen', role: 'Senior Frontend Developer', company: 'TechCorp', match: 95 },
                { name: 'Mike Johnson', role: 'DevOps Engineer', company: 'StartupXYZ', match: 88 },
                { name: 'Lisa Wang', role: 'Product Manager', company: 'InnovateCo', match: 92 },
              ].map((candidate, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.role} at {candidate.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{candidate.match}% match</p>
                    <button className="text-xs text-blue-600 hover:underline">Contact</button>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/matches"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              View all matches
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Campaigns</h3>
            <div className="space-y-4">
              {[
                { name: 'Frontend Developer Outreach', sent: 45, opened: 32, replied: 12 },
                { name: 'Senior PM Campaign', sent: 28, opened: 19, replied: 8 },
                { name: 'DevOps Specialists', sent: 16, opened: 11, replied: 5 },
              ].map((campaign, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Sent</p>
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.sent}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Opened</p>
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.opened}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Replied</p>
                      <p className="font-medium text-gray-900 dark:text-white">{campaign.replied}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/campaigns"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              View all campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}