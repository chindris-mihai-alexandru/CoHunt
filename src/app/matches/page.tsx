'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Mail, 
  Star, 
  MapPin, 
  Briefcase, 
  Calendar,
  Filter,
  Search,
  ExternalLink,
  Heart,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  email: string;
  linkedin: string;
  skills: string[];
  experience: number;
  salary: {
    min: number;
    max: number;
  };
  matchScore: number;
  matchReasons: string[];
  lastActive: string;
  isAvailable: boolean;
  profileImage?: string;
  bio: string;
}

export default function MatchesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minMatchScore: 70,
    availability: 'all', // all, available, not-available
    experienceLevel: 'all', // all, junior, mid, senior
    location: 'all'
  });
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading candidate matches
    setTimeout(() => {
      setCandidates([
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          email: 'sarah.chen@email.com',
          linkedin: 'https://linkedin.com/in/sarahchen',
          skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'AWS'],
          experience: 6,
          salary: { min: 140000, max: 170000 },
          matchScore: 95,
          matchReasons: [
            'Perfect skill match for React/TypeScript roles',
            'Senior-level experience aligns with your placements',
            'Located in your target market (SF Bay Area)',
            'Salary expectations match your client budgets'
          ],
          lastActive: '2024-01-20',
          isAvailable: true,
          bio: 'Passionate frontend developer with expertise in modern React ecosystem. Led multiple high-impact projects at scale.'
        },
        {
          id: '2',
          name: 'Mike Johnson',
          title: 'DevOps Engineer',
          company: 'StartupXYZ',
          location: 'Austin, TX',
          email: 'mike.johnson@email.com',
          linkedin: 'https://linkedin.com/in/mikejohnson',
          skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python'],
          experience: 4,
          salary: { min: 120000, max: 150000 },
          matchScore: 88,
          matchReasons: [
            'Strong DevOps skills match your client needs',
            'Mid-level experience perfect for growth roles',
            'Open to relocation for the right opportunity'
          ],
          lastActive: '2024-01-19',
          isAvailable: true,
          bio: 'DevOps engineer focused on cloud infrastructure and automation. Experience with high-traffic applications.'
        },
        {
          id: '3',
          name: 'Lisa Wang',
          title: 'Product Manager',
          company: 'InnovateCo',
          location: 'New York, NY',
          email: 'lisa.wang@email.com',
          linkedin: 'https://linkedin.com/in/lisawang',
          skills: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research', 'SQL'],
          experience: 8,
          salary: { min: 160000, max: 200000 },
          matchScore: 92,
          matchReasons: [
            'Senior PM experience matches your client requirements',
            'Strong analytical background',
            'Proven track record in B2B products'
          ],
          lastActive: '2024-01-18',
          isAvailable: false,
          bio: 'Senior Product Manager with 8+ years building data-driven products. Led teams of 15+ engineers and designers.'
        },
        {
          id: '4',
          name: 'David Rodriguez',
          title: 'Full Stack Developer',
          company: 'WebSolutions',
          location: 'Remote',
          email: 'david.rodriguez@email.com',
          linkedin: 'https://linkedin.com/in/davidrodriguez',
          skills: ['Node.js', 'React', 'PostgreSQL', 'MongoDB', 'Express'],
          experience: 5,
          salary: { min: 110000, max: 140000 },
          matchScore: 82,
          matchReasons: [
            'Full-stack skills match multiple client needs',
            'Remote work experience',
            'Competitive salary expectations'
          ],
          lastActive: '2024-01-21',
          isAvailable: true,
          bio: 'Full-stack developer with strong backend focus. Experience building scalable web applications from scratch.'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  };

  const toggleSaveCandidate = (candidateId: string) => {
    if (savedCandidates.includes(candidateId)) {
      setSavedCandidates(savedCandidates.filter(id => id !== candidateId));
      toast.success('Candidate removed from saved list');
    } else {
      setSavedCandidates([...savedCandidates, candidateId]);
      toast.success('Candidate saved for later');
    }
  };

  const sendEmail = (candidate: Candidate) => {
    // In a real app, this would open an email composer or send via API
    toast.success(`Email composer opened for ${candidate.name}`);
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Match score filter
    if (candidate.matchScore < filters.minMatchScore) {
      return false;
    }

    // Availability filter
    if (filters.availability === 'available' && !candidate.isAvailable) {
      return false;
    }
    if (filters.availability === 'not-available' && candidate.isAvailable) {
      return false;
    }

    // Experience level filter
    if (filters.experienceLevel === 'junior' && candidate.experience >= 3) {
      return false;
    }
    if (filters.experienceLevel === 'mid' && (candidate.experience < 3 || candidate.experience > 7)) {
      return false;
    }
    if (filters.experienceLevel === 'senior' && candidate.experience <= 7) {
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Matches</h1>
              <p className="text-gray-600 dark:text-gray-400">AI-powered candidate recommendations based on your profile and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredCandidates.length} of {candidates.length} candidates
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates, skills, or titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Match Score Filter */}
            <div>
              <select
                value={filters.minMatchScore}
                onChange={(e) => setFilters({ ...filters, minMatchScore: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={0}>All Match Scores</option>
                <option value={70}>70%+ Match</option>
                <option value={80}>80%+ Match</option>
                <option value={90}>90%+ Match</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Candidates</option>
                <option value="available">Available Only</option>
                <option value="not-available">Not Available</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Experience</option>
                <option value="junior">Junior (0-3 years)</option>
                <option value="mid">Mid (3-7 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matches found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search criteria to find more candidates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{candidate.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{candidate.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore}% match
                    </span>
                    <button
                      onClick={() => toggleSaveCandidate(candidate.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedCandidates.includes(candidate.id)
                          ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedCandidates.includes(candidate.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.location}</span>
                    <span className="mx-2">•</span>
                    <Briefcase className="w-4 h-4" />
                    <span>{candidate.experience} years exp</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      candidate.isAvailable 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {candidate.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      ${candidate.salary.min.toLocaleString()} - ${candidate.salary.max.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {candidate.bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Why this is a good match:</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {candidate.matchReasons.slice(0, 2).map((reason, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => sendEmail(candidate)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                  <a
                    href={candidate.linkedin}
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