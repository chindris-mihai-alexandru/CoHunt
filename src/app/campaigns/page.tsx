'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  Plus, 
  Mail, 
  Users, 
  TrendingUp, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  BarChart3,
  Calendar,
  Target,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'outreach' | 'nurture' | 'follow-up';
  targetRole: string;
  emailsSent: number;
  openRate: number;
  responseRate: number;
  createdAt: string;
  lastSent: string;
  totalRecipients: number;
  subject: string;
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'paused' | 'completed'>('all');

  useEffect(() => {
    // Simulate loading campaigns
    setTimeout(() => {
      setCampaigns([
        {
          id: '1',
          name: 'Frontend Developer Outreach Q1',
          status: 'active',
          type: 'outreach',
          targetRole: 'Frontend Developer',
          emailsSent: 45,
          openRate: 68,
          responseRate: 24,
          createdAt: '2024-01-15',
          lastSent: '2024-01-20',
          totalRecipients: 67,
          subject: 'Exciting Frontend Opportunities at Top Tech Companies'
        },
        {
          id: '2',
          name: 'Senior PM Follow-up',
          status: 'active',
          type: 'follow-up',
          targetRole: 'Product Manager',
          emailsSent: 28,
          openRate: 75,
          responseRate: 32,
          createdAt: '2024-01-10',
          lastSent: '2024-01-18',
          totalRecipients: 35,
          subject: 'Following up on Product Manager opportunities'
        },
        {
          id: '3',
          name: 'DevOps Specialists Nurture',
          status: 'paused',
          type: 'nurture',
          targetRole: 'DevOps Engineer',
          emailsSent: 16,
          openRate: 62,
          responseRate: 18,
          createdAt: '2024-01-05',
          lastSent: '2024-01-12',
          totalRecipients: 25,
          subject: 'DevOps Career Insights and Opportunities'
        },
        {
          id: '4',
          name: 'Data Science Talent Pool',
          status: 'draft',
          type: 'outreach',
          targetRole: 'Data Scientist',
          emailsSent: 0,
          openRate: 0,
          responseRate: 0,
          createdAt: '2024-01-20',
          lastSent: '',
          totalRecipients: 42,
          subject: 'Cutting-edge Data Science Roles Available'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'outreach': return <Send className="w-4 h-4" />;
      case 'nurture': return <Users className="w-4 h-4" />;
      case 'follow-up': return <Mail className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    toast.success('Campaign deleted');
  };

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === filter);

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Campaigns</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your automated email sequences and outreach campaigns</p>
            </div>
            <Link
              href="/campaigns/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.reduce((sum, campaign) => sum + campaign.emailsSent, 0)}
                </p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Open Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(campaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / campaigns.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(campaigns.reduce((sum, campaign) => sum + campaign.responseRate, 0) / campaigns.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'draft', 'paused', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 text-xs">
                    ({campaigns.filter(c => c.status === status).length})
                  </span>
                )}
                {status === 'all' && (
                  <span className="ml-2 text-xs">({campaigns.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {filter === 'all' ? 'All Campaigns' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Campaigns`}
            </h2>
            
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {filter === 'all' 
                    ? "You haven't created any campaigns yet." 
                    : `No ${filter} campaigns found.`}
                </p>
                <Link
                  href="/campaigns/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(campaign.type)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCampaignStatus(campaign.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            campaign.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={campaign.status === 'active' ? 'Pause campaign' : 'Activate campaign'}
                        >
                          {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/campaigns/${campaign.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit campaign"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Target Role</p>
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.targetRole}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Emails Sent</p>
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.emailsSent}/{campaign.totalRecipients}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Open Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Response Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.responseRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Last Sent</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.lastSent ? new Date(campaign.lastSent).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Subject:</span> {campaign.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}