'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  ExternalLink,
  MessageSquare,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  lastUpdate: string;
  nextAction: string;
  nextActionDate: string;
  salary: string;
  location: string;
  jobUrl: string;
  notes: string;
  communications: {
    id: string;
    type: 'email' | 'phone' | 'interview' | 'note';
    date: string;
    subject: string;
    content: string;
  }[];
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    // Simulate loading application data
    setTimeout(() => {
      setApplications([
        {
          id: '1',
          jobTitle: 'Senior Frontend Developer',
          company: 'TechCorp',
          status: 'interview',
          appliedDate: '2024-01-15',
          lastUpdate: '2024-01-20',
          nextAction: 'Technical Interview',
          nextActionDate: '2024-01-25',
          salary: '$140,000 - $180,000',
          location: 'San Francisco, CA',
          jobUrl: 'https://techcorp.com/jobs/senior-frontend',
          notes: 'Great company culture, exciting product. Recruiter mentioned they are looking for React expertise.',
          communications: [
            {
              id: '1',
              type: 'email',
              date: '2024-01-20',
              subject: 'Interview Scheduled - Technical Round',
              content: 'Hi John, We would like to schedule your technical interview for January 25th at 2 PM PST.'
            },
            {
              id: '2',
              type: 'phone',
              date: '2024-01-18',
              subject: 'Initial Screening Call',
              content: '30-minute call with Sarah from HR. Discussed background and role expectations.'
            }
          ]
        },
        {
          id: '2',
          jobTitle: 'Full Stack Engineer',
          company: 'StartupXYZ',
          status: 'applied',
          appliedDate: '2024-01-18',
          lastUpdate: '2024-01-18',
          nextAction: 'Follow up',
          nextActionDate: '2024-01-25',
          salary: '$120,000 - $160,000',
          location: 'Remote',
          jobUrl: 'https://startupxyz.com/careers/fullstack',
          notes: 'Applied through their website. No response yet.',
          communications: []
        },
        {
          id: '3',
          jobTitle: 'React Developer',
          company: 'InnovateCo',
          status: 'offer',
          appliedDate: '2024-01-10',
          lastUpdate: '2024-01-22',
          nextAction: 'Respond to offer',
          nextActionDate: '2024-01-26',
          salary: '$130,000 - $150,000',
          location: 'New York, NY',
          jobUrl: 'https://innovateco.com/jobs/react-dev',
          notes: 'Received offer! Need to negotiate salary and review benefits package.',
          communications: [
            {
              id: '3',
              type: 'email',
              date: '2024-01-22',
              subject: 'Job Offer - React Developer Position',
              content: 'Congratulations! We are pleased to extend an offer for the React Developer position.'
            }
          ]
        },
        {
          id: '4',
          jobTitle: 'Frontend Engineer',
          company: 'DesignStudio',
          status: 'rejected',
          appliedDate: '2024-01-05',
          lastUpdate: '2024-01-15',
          nextAction: 'None',
          nextActionDate: '',
          salary: '$100,000 - $130,000',
          location: 'Austin, TX',
          jobUrl: 'https://designstudio.com/careers',
          notes: 'They went with someone with more design system experience.',
          communications: [
            {
              id: '4',
              type: 'email',
              date: '2024-01-15',
              subject: 'Update on Your Application',
              content: 'Thank you for your interest. We have decided to move forward with another candidate.'
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'screening': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'interview': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'offer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'screening': return <AlertCircle className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (searchQuery && !app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addNote = (appId: string, note: string) => {
    setApplications(applications.map(app => 
      app.id === appId 
        ? { 
            ...app, 
            communications: [...app.communications, {
              id: Date.now().toString(),
              type: 'note',
              date: new Date().toISOString().split('T')[0],
              subject: 'Personal Note',
              content: note
            }]
          }
        : app
    ));
    toast.success('Note added successfully');
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
              <p className="text-gray-600 dark:text-gray-400">Track and manage all your job applications in one place</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Application
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', count: applications.length, color: 'bg-gray-100 text-gray-800' },
            { label: 'Applied', count: applications.filter(a => a.status === 'applied').length, color: 'bg-blue-100 text-blue-800' },
            { label: 'Interviews', count: applications.filter(a => a.status === 'interview').length, color: 'bg-purple-100 text-purple-800' },
            { label: 'Offers', count: applications.filter(a => a.status === 'offer').length, color: 'bg-green-100 text-green-800' },
            { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, color: 'bg-red-100 text-red-800' },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'applied', 'screening', 'interview', 'offer', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? "You haven't applied to any jobs yet." 
                : `No ${filter} applications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {application.company.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{application.jobTitle}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{application.company}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.location} • {application.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedApp(selectedApp?.id === application.id ? null : application)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {new Date(application.lastUpdate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Next Action:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {application.nextAction}
                      {application.nextActionDate && (
                        <span className="text-orange-600 dark:text-orange-400 ml-1">
                          ({new Date(application.nextActionDate).toLocaleDateString()})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {application.notes && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{application.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Follow-up
                  </button>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Job
                  </a>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Add Note
                  </button>
                </div>

                {/* Communications History */}
                {application.communications.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Communication History</h4>
                    <div className="space-y-2">
                      {application.communications.slice(0, 2).map((comm) => (
                        <div key={comm.id} className="flex items-start gap-3 text-sm">
                          <div className="flex-shrink-0 mt-1">
                            {comm.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                            {comm.type === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                            {comm.type === 'interview' && <Calendar className="w-4 h-4 text-purple-600" />}
                            {comm.type === 'note' && <FileText className="w-4 h-4 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">{comm.subject}</span>
                              <span className="text-gray-500 dark:text-gray-400">•</span>
                              <span className="text-gray-500 dark:text-gray-400">{new Date(comm.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{comm.content}</p>
                          </div>
                        </div>
                      ))}
                      {application.communications.length > 2 && (
                        <button className="text-blue-600 hover:underline text-sm">
                          View all {application.communications.length} communications
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}