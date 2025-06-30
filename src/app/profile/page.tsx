'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  Plus, 
  Edit3, 
  Save, 
  X,
  Award,
  Target,
  DollarSign,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RecruiterProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  company: string;
  bio: string;
  specializations: string[];
  experience: number;
  placementsMade: number;
  averageSalary: number;
  successRate: number;
  industries: string[];
  skills: string[];
  certifications: string[];
  portfolio: {
    title: string;
    description: string;
    company: string;
    salary: string;
    timeToFill: string;
  }[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    website: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile({
        id: user?.id || '1',
        name: user?.user_metadata?.name || 'Alex Thompson',
        email: user?.email || 'alex@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        title: 'Senior Technical Recruiter',
        company: 'TechTalent Solutions',
        bio: 'Passionate technical recruiter with 8+ years of experience placing top-tier software engineers, data scientists, and product managers at leading tech companies. Specialized in full-stack development, AI/ML, and fintech roles.',
        specializations: ['Software Engineering', 'Data Science', 'Product Management', 'DevOps'],
        experience: 8,
        placementsMade: 156,
        averageSalary: 145000,
        successRate: 92,
        industries: ['Technology', 'Fintech', 'Healthcare Tech', 'E-commerce'],
        skills: ['Technical Screening', 'Salary Negotiation', 'Candidate Sourcing', 'Client Relations'],
        certifications: ['Certified Talent Acquisition Professional', 'LinkedIn Certified Professional Recruiter'],
        portfolio: [
          {
            title: 'Senior Full-Stack Engineer',
            description: 'Placed a senior engineer with expertise in React, Node.js, and AWS at a fast-growing fintech startup.',
            company: 'PayFlow Inc.',
            salary: '$165,000',
            timeToFill: '18 days'
          },
          {
            title: 'Lead Data Scientist',
            description: 'Successfully recruited a lead data scientist with PhD in Machine Learning for a healthcare AI company.',
            company: 'MedAI Solutions',
            salary: '$180,000',
            timeToFill: '25 days'
          },
          {
            title: 'VP of Engineering',
            description: 'Executive placement for a VP of Engineering role at a Series B startup, managing a team of 40+ engineers.',
            company: 'ScaleUp Tech',
            salary: '$275,000',
            timeToFill: '45 days'
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/alexthompson',
          twitter: 'https://twitter.com/alexrecruiter',
          website: 'https://alexthompson.dev'
        }
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSpecialization = () => {
    if (profile) {
      setProfile({
        ...profile,
        specializations: [...profile.specializations, '']
      });
    }
  };

  const removeSpecialization = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        specializations: profile.specializations.filter((_, i) => i !== index)
      });
    }
  };

  const updateSpecialization = (index: number, value: string) => {
    if (profile) {
      const newSpecializations = [...profile.specializations];
      newSpecializations[index] = value;
      setProfile({
        ...profile,
        specializations: newSpecializations
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load your profile. Please try again.</p>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your professional profile and showcase your expertise</p>
            </div>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info & Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{profile.title}</p>
                    <p className="text-gray-600 dark:text-gray-400">{profile.company}</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{profile.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{profile.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{profile.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-blue-600 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.placementsMade}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Placements</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-green-600 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.successRate}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${(profile.averageSalary / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Salary</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-orange-600 mr-1" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.experience}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Years Exp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Bio</h3>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* Specializations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Specializations</h3>
                {isEditing && (
                  <button
                    onClick={addSpecialization}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <div key={index} className="relative">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => updateSpecialization(index, e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          onClick={() => removeSpecialization(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {spec}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Industries</h3>
              <div className="flex flex-wrap gap-2">
                {profile.industries.map((industry, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Placements</h3>
              <div className="space-y-4">
                {profile.portfolio.map((placement, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{placement.title}</h4>
                      <span className="text-sm text-green-600 font-medium">{placement.salary}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{placement.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{placement.company}</span>
                      <span>Filled in {placement.timeToFill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h3>
                <div className="space-y-2">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}