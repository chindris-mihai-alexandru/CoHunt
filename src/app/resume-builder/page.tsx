'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Eye, 
  Wand2, 
  Target,
  Plus,
  Edit3,
  Trash2,
  Save,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  content: any;
}

interface JobMatch {
  jobTitle: string;
  company: string;
  description: string;
  requirements: string[];
}

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    sections: [] as ResumeSection[]
  });
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resume data
    setTimeout(() => {
      setResume({
        personalInfo: {
          name: user?.user_metadata?.name || 'John Doe',
          email: user?.email || 'john@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/johndoe',
          website: 'johndoe.dev'
        },
        summary: 'Experienced software engineer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading development teams.',
        sections: [
          {
            id: '1',
            type: 'experience',
            title: 'Work Experience',
            content: [
              {
                title: 'Senior Frontend Developer',
                company: 'TechCorp',
                location: 'San Francisco, CA',
                duration: '2022 - Present',
                description: [
                  'Led development of React-based dashboard serving 10k+ daily users',
                  'Improved application performance by 40% through code optimization',
                  'Mentored 3 junior developers and established coding standards'
                ]
              },
              {
                title: 'Full Stack Developer',
                company: 'StartupXYZ',
                location: 'Remote',
                duration: '2020 - 2022',
                description: [
                  'Built and maintained Node.js APIs handling 1M+ requests daily',
                  'Implemented CI/CD pipeline reducing deployment time by 60%',
                  'Collaborated with design team to create responsive web interfaces'
                ]
              }
            ]
          },
          {
            id: '2',
            type: 'skills',
            title: 'Technical Skills',
            content: {
              categories: [
                {
                  name: 'Frontend',
                  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux']
                },
                {
                  name: 'Backend',
                  skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB']
                },
                {
                  name: 'Tools & Cloud',
                  skills: ['AWS', 'Docker', 'Git', 'Jenkins', 'Kubernetes']
                }
              ]
            }
          },
          {
            id: '3',
            type: 'education',
            title: 'Education',
            content: [
              {
                degree: 'Bachelor of Science in Computer Science',
                school: 'University of California, Berkeley',
                location: 'Berkeley, CA',
                year: '2020',
                gpa: '3.8/4.0'
              }
            ]
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const optimizeForJob = async (job: JobMatch) => {
    setIsOptimizing(true);
    setSelectedJob(job);
    
    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock optimization suggestions
      const suggestions = [
        'Added relevant keywords from job description',
        'Emphasized React and TypeScript experience',
        'Highlighted team leadership skills',
        'Adjusted summary to match company culture'
      ];
      
      toast.success(`Resume optimized for ${job.jobTitle} at ${job.company}!`);
      
      // Show what was optimized
      suggestions.forEach((suggestion, index) => {
        setTimeout(() => {
          toast.success(suggestion, { duration: 2000 });
        }, index * 500);
      });
      
    } catch (error) {
      toast.error('Failed to optimize resume');
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadResume = () => {
    toast.success('Resume downloaded as PDF');
    // In a real app, this would generate and download a PDF
  };

  const addSection = (type: ResumeSection['type']) => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: type === 'skills' ? { categories: [] } : []
    };
    
    setResume({
      ...resume,
      sections: [...resume.sections, newSection]
    });
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
              <p className="text-gray-600 dark:text-gray-400">Create and optimize your resume for specific job applications</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={downloadResume}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Resume Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resume.personalInfo.name}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={resume.personalInfo.email}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={resume.personalInfo.phone}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={resume.personalInfo.location}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, location: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="LinkedIn"
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, linkedin: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={resume.personalInfo.website}
                  onChange={(e) => setResume({
                    ...resume,
                    personalInfo: { ...resume.personalInfo, website: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Summary</h3>
              <textarea
                rows={4}
                placeholder="Write a compelling summary of your experience and skills..."
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Resume Sections */}
            {resume.sections.map((section) => (
              <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section content would be rendered here based on type */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {section.type === 'experience' && 'Work experience entries...'}
                  {section.type === 'skills' && 'Technical skills...'}
                  {section.type === 'education' && 'Education details...'}
                  {section.type === 'projects' && 'Project descriptions...'}
                  {section.type === 'certifications' && 'Certifications and awards...'}
                </div>
              </div>
            ))}

            {/* Add Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Section</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['experience', 'education', 'skills', 'projects', 'certifications'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Optimization */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                AI Optimization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Optimize your resume for specific job applications using AI.
              </p>
              
              {/* Sample Jobs for Demo */}
              <div className="space-y-3">
                {[
                  {
                    jobTitle: 'Senior React Developer',
                    company: 'TechCorp',
                    description: 'Looking for a senior React developer...',
                    requirements: ['React', 'TypeScript', 'Node.js']
                  },
                  {
                    jobTitle: 'Full Stack Engineer',
                    company: 'StartupXYZ',
                    description: 'Full stack engineer position...',
                    requirements: ['JavaScript', 'Python', 'AWS']
                  }
                ].map((job, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{job.jobTitle}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{job.company}</p>
                    <button
                      onClick={() => optimizeForJob(job)}
                      disabled={isOptimizing}
                      className="mt-2 w-full px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {isOptimizing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        <Target className="w-3 h-3" />
                      )}
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Modern', 'Classic', 'Creative', 'Minimal'].map((template) => (
                  <button
                    key={template}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Import Resume */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Resume</h3>
              <button className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload PDF or DOCX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}