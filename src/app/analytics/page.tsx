'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Target, 
  Calendar,
  Eye,
  MessageCircle,
  DollarSign
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalEmails: number;
    openRate: number;
    responseRate: number;
    placementRate: number;
    avgTimeToResponse: number;
    revenue: number;
  };
  trends: {
    period: string;
    emails: number;
    opens: number;
    responses: number;
    placements: number;
  }[];
  campaignPerformance: {
    name: string;
    sent: number;
    opened: number;
    responded: number;
    openRate: number;
    responseRate: number;
  }[];
  topSkills: {
    skill: string;
    placements: number;
    avgSalary: number;
  }[];
}

export default function AnalyticsPage() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setData({
        overview: {
          totalEmails: 1247,
          openRate: 68.5,
          responseRate: 24.3,
          placementRate: 8.7,
          avgTimeToResponse: 2.4,
          revenue: 180000
        },
        trends: [
          { period: 'Week 1', emails: 45, opens: 32, responses: 12, placements: 3 },
          { period: 'Week 2', emails: 52, opens: 38, responses: 15, placements: 4 },
          { period: 'Week 3', emails: 38, opens: 28, responses: 9, placements: 2 },
          { period: 'Week 4', emails: 61, opens: 44, responses: 18, placements: 5 },
        ],
        campaignPerformance: [
          { name: 'Frontend Developer Outreach', sent: 156, opened: 112, responded: 38, openRate: 71.8, responseRate: 24.4 },
          { name: 'Senior PM Campaign', sent: 89, opened: 67, responded: 23, openRate: 75.3, responseRate: 25.8 },
          { name: 'DevOps Specialists', sent: 134, opened: 87, responded: 19, openRate: 64.9, responseRate: 14.2 },
          { name: 'Data Science Talent', sent: 78, opened: 52, responded: 16, openRate: 66.7, responseRate: 20.5 },
        ],
        topSkills: [
          { skill: 'React', placements: 12, avgSalary: 145000 },
          { skill: 'Python', placements: 8, avgSalary: 135000 },
          { skill: 'AWS', placements: 10, avgSalary: 140000 },
          { skill: 'Node.js', placements: 7, avgSalary: 130000 },
          { skill: 'TypeScript', placements: 9, avgSalary: 142000 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Data Available</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load analytics data. Please try again.</p>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your recruiting performance and optimize your outreach</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-blue-600" />
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                12.5%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalEmails.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Emails</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                8.2%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.openRate}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                5.7%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.responseRate}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-orange-600" />
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                15.3%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.placementRate}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Placement Rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <div className="flex items-center text-red-600 text-sm">
                <TrendingDown className="w-4 h-4 mr-1" />
                3.1%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.avgTimeToResponse}d</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                22.8%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${(data.overview.revenue / 1000).toFixed(0)}k</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Email Performance Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Performance Trends</h3>
            <div className="space-y-4">
              {data.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-20">{trend.period}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>{trend.emails} sent</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{trend.opens} opened</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>{trend.responses} replied</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                    {trend.placements} placed
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Skills</h3>
            <div className="space-y-4">
              {data.topSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{skill.skill}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{skill.placements} placements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">${(skill.avgSalary / 1000).toFixed(0)}k</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">avg salary</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Opened</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Responded</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Open Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Response Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.campaignPerformance.map((campaign, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{campaign.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.sent}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.opened}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.responded}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.openRate >= 70 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : campaign.openRate >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {campaign.openRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.responseRate >= 25 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : campaign.responseRate >= 15
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {campaign.responseRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}