'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Star, 
  MapPin, 
  Briefcase, 
  Mail,
  Filter,
  Search,
  ExternalLink,
  Award,
  TrendingUp,
  Building2,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Recruiter {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  specializations: string[];
  experience: number;
  placementsMade: number;
  successRate: number;
  averageSalary: number;
  rating: number;
  bio: string;
  linkedinUrl: string;
  email: string;
  recentPlacements: {
    role: string;
    company: string;
    salary: string;
  }[];
  industries: string[];
}

export default function RecruitersPage() {
  const { user } = useAuth();
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading recruiter data
    setTimeout(() => {
      setRecruiters([
        {
          id: '1',
          name: 'Sarah Johnson',
          title: 'Senior Technical Recruiter',
          company: 'TechTalent Solutions',
          location: 'San Francisco, CA',
          specializations: ['Frontend Development', 'React', 'JavaScript', 'TypeScript'],
          experience: 8,
          placementsMade: 156,
          successRate: 92,
          averageSalary: 145000,
          rating: 4.9,
          bio: 'Passionate technical recruiter with 8+ years of experience placing top-tier software engineers at leading tech companies. Specialized in frontend development roles.',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          email: 'sarah@techtalent.com',
          recentPlacements: [
            { role: 'Senior React Developer', company: 'Stripe', salary: '$180k' },
            { role: 'Frontend Lead', company: 'Airbnb', salary: '$200k' },
            { role: 'Full Stack Engineer', company: 'Uber', salary: '$165k' }
          ],
          industries: ['Fintech', 'Travel', 'Transportation']
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'Principal Recruiter - Backend Systems',
          company: 'Elite Engineering Recruiting',
          location: 'Seattle, WA',
          specializations: ['Backend Development', 'Python', 'Go', 'Microservices'],
          experience: 12,
          placementsMade: 203,
          successRate: 89,
          averageSalary: 155000,
          rating: 4.8,
          bio: 'Veteran recruiter specializing in backend and infrastructure roles. Deep network in the Seattle tech scene with focus on scalable systems.',
          linkedinUrl: 'https://linkedin.com/in/michaelchen',
          email: 'michael@eliteengineering.com',
          recentPlacements: [
            { role: 'Staff Backend Engineer', company: 'Amazon', salary: '$220k' },
            { role: 'Principal Engineer', company: 'Microsoft', salary: '$250k' },
            { role: 'Backend Lead', company: 'Snowflake', salary: '$190k' }
          ],
          industries: ['Cloud Computing', 'Enterprise Software', 'Data']
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          title: 'Product & Design Recruiter',
          company: 'Creative Talent Partners',
          location: 'New York, NY',
          specializations: ['Product Management', 'UX Design', 'Product Strategy'],
          experience: 6,
          placementsMade: 89,
          successRate: 94,
          averageSalary: 135000,
          rating: 4.7,
          bio: 'Specialized in product and design roles with a keen eye for matching candidates with company culture and product vision.',
          linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
          email: 'emily@creativetalent.com',
          recentPlacements: [
            { role: 'Senior Product Manager', company: 'Spotify', salary: '$160k' },
            { role: 'Lead UX Designer', company: 'Netflix', salary: '$140k' },
            { role: 'Product Director', company: 'Slack', salary: '$200k' }
          ],
          industries: ['Media', 'Entertainment', 'SaaS']
        },
        {
          id: '4',
          name: 'David Kim',
          title: 'Data & AI Recruiter',
          company: 'DataTech Recruiting',
          location: 'Austin, TX',
          specializations: ['Data Science', 'Machine Learning', 'AI', 'Analytics'],
          experience: 5,
          placementsMade: 67,
          successRate: 91,
          averageSalary: 140000,
          rating: 4.6,
          bio: 'Focused on data science and AI roles. Strong connections with both startups and big tech companies looking for data talent.',
          linkedinUrl: 'https://linkedin.com/in/davidkim',
          email: 'david@datatech.com',
          recentPlacements: [
            { role: 'Senior Data Scientist', company: 'Tesla', salary: '$170k' },
            { role: 'ML Engineer', company: 'OpenAI', salary: '$200k' },
            { role: 'Data Lead', company: 'Databricks', salary: '$185k' }
          ],
          industries: ['AI/ML', 'Automotive', 'Analytics']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const contactRecruiter = (recruiter: Recruiter) => {
    toast.success(`Email draft created for ${recruiter.name}`);
    // In a real app, this would open an email composer or messaging interface
  };

  const filteredRecruiters = recruiters.filter(recruiter => {
    // Search filter
    if (searchQuery && !recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recruiter.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !recruiter.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Specialization filter
    if (specializationFilter !== 'all' && 
        !recruiter.specializations.some(spec => spec.toLowerCase().includes(specializationFilter.toLowerCase()))) {
      return false;
    }

    // Location filter
    if (locationFilter && !recruiter.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Recruiters</h1>
              <p className="text-gray-600 dark:text-gray-400">Connect with specialized recruiters who can help advance your career</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredRecruiters.length} recruiters found
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search recruiters, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Specializations</option>
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="fullstack">Full Stack</option>
              <option value="data">Data Science</option>
              <option value="product">Product Management</option>
              <option value="design">Design</option>
            </select>
          </div>
        </div>

        {/* Recruiters Grid */}
        {filteredRecruiters.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recruiters found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria to find more recruiters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecruiters.map((recruiter) => (
              <div key={recruiter.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {recruiter.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{recruiter.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{recruiter.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{recruiter.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{recruiter.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{recruiter.placementsMade}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Placements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{recruiter.successRate}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${(recruiter.averageSalary / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Salary</p>
                  </div>
                </div>

                {/* Location and Experience */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{recruiter.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{recruiter.experience} years</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                  {recruiter.bio}
                </p>

                {/* Specializations */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {recruiter.specializations.slice(0, 3).map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {spec}
                      </span>
                    ))}
                    {recruiter.specializations.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{recruiter.specializations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Recent Placements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recent Placements</h4>
                  <div className="space-y-1">
                    {recruiter.recentPlacements.slice(0, 2).map((placement, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{placement.role}</span> at {placement.company} • {placement.salary}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => contactRecruiter(recruiter)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </button>
                  <a
                    href={recruiter.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}