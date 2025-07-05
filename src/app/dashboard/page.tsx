'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  FileText, 
  Mail, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  ArrowUpRight,
  Plus,
  Users,
  Briefcase,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  jobsApplied: number;
  interviewsScheduled: number;
  responseRate: number;
  profileViews: number;
  savedJobs: number;
  activeApplications: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    jobsApplied: 0,
    interviewsScheduled: 0,
    responseRate: 0,
    profileViews: 0,
    savedJobs: 0,
    activeApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values on error
        setStats({
          jobsApplied: 0,
          interviewsScheduled: 0,
          responseRate: 0,
          profileViews: 0,
          savedJobs: 0,
          activeApplications: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Search Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.user_metadata?.name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/jobs"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit Profile
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
              href="/jobs"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find Jobs</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Search</p>
                </div>
                <Search className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/applications"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeApplications}</p>
                </div>
                <FileText className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/recruiters"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find Recruiters</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Browse</p>
                </div>
                <Users className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            <Link
              href="/resume-builder"
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resume Builder</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Optimize</p>
                </div>
                <Target className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs Applied</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.jobsApplied}</p>
            <p className="text-sm text-green-600">+5 this week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interviews</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.interviewsScheduled}</p>
            <p className="text-sm text-blue-600">2 this week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response Rate</h3>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.responseRate}%</p>
            <p className="text-sm text-purple-600">Above average</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Views</h3>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.profileViews}</p>
            <p className="text-sm text-orange-600">+12 this week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Jobs</h3>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.savedJobs}</p>
            <p className="text-sm text-yellow-600">Ready to apply</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Apps</h3>
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.activeApplications}</p>
            <p className="text-sm text-indigo-600">In progress</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h3>
            <div className="space-y-4">
              {[
                { company: 'TechCorp', role: 'Senior Frontend Developer', status: 'Interview Scheduled', date: '2 days ago', statusColor: 'text-blue-600' },
                { company: 'StartupXYZ', role: 'Full Stack Engineer', status: 'Application Sent', date: '3 days ago', statusColor: 'text-yellow-600' },
                { company: 'InnovateCo', role: 'React Developer', status: 'Under Review', date: '5 days ago', statusColor: 'text-purple-600' },
              ].map((application, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{application.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{application.company} • {application.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${application.statusColor}`}>{application.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/applications"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              View all applications
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tasks</h3>
            <div className="space-y-4">
              {[
                { task: 'Follow up with TechCorp recruiter', type: 'Follow-up', due: 'Today', icon: Mail, color: 'text-red-600' },
                { task: 'Prepare for StartupXYZ interview', type: 'Interview Prep', due: 'Tomorrow', icon: Calendar, color: 'text-blue-600' },
                { task: 'Update resume for Data Science roles', type: 'Resume', due: 'This week', icon: FileText, color: 'text-green-600' },
              ].map((task, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{task.task}</p>
                    <task.icon className={`w-4 h-4 ${task.color}`} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{task.type}</span>
                    <span className={`font-medium ${task.color}`}>{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/tasks"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              View all tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}