'use client';

import { useState } from 'react';
import { Search, Upload, MapPin, Briefcase } from 'lucide-react';
import { 
  LiquidCard, 
  LiquidButton, 
  LiquidInput, 
  LiquidSelect,
  LiquidBadge 
} from '@/components/liquid-glass';

interface JobSearchFormLiquidProps {
  onSearch: (data: any) => void;
  isLoading: boolean;
}

export default function JobSearchFormLiquid({ onSearch, isLoading }: JobSearchFormLiquidProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  const jobTypeOptions = [
    { value: '', label: 'All Job Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchData = {
      query: query.trim(),
      location: location.trim(),
      jobType: jobType || undefined,
      hasResume: !!resume,
    };

    if (resume) {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('searchData', JSON.stringify(searchData));
      onSearch(formData);
    } else {
      onSearch(searchData);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  return (
    <LiquidCard hover className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Find Your Dream Job
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered job search across 100+ platforms
          </p>
        </div>

        {/* Main Search Input */}
        <LiquidInput
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title, skills, or company..."
          required
          className="text-lg"
        />

        {/* Location and Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LiquidInput
            icon={MapPin}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (optional)"
          />

          <LiquidSelect
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            options={jobTypeOptions}
          />
        </div>

        {/* Resume Upload */}
        <LiquidCard variant="secondary" className="text-center">
          <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Upload your resume for better job matching
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <LiquidButton
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('resume-upload')?.click();
              }}
            >
              Choose PDF File
            </LiquidButton>
          </label>
          {resume && (
            <div className="mt-3">
              <LiquidBadge variant="success" size="sm">
                ✓ {resume.name} uploaded
              </LiquidBadge>
            </div>
          )}
        </LiquidCard>

        {/* Search Button */}
        <LiquidButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Searching Jobs...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Search Jobs
            </div>
          )}
        </LiquidButton>
      </form>

      {/* Search Tips */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span> Pro Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start">
            <LiquidBadge variant="primary" size="sm" className="mr-2 mt-0.5">1</LiquidBadge>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use specific skills like "React", "Python", or "Product Manager"
            </p>
          </div>
          <div className="flex items-start">
            <LiquidBadge variant="primary" size="sm" className="mr-2 mt-0.5">2</LiquidBadge>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Include company names for targeted searches
            </p>
          </div>
          <div className="flex items-start">
            <LiquidBadge variant="primary" size="sm" className="mr-2 mt-0.5">3</LiquidBadge>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your resume for AI-powered matching
            </p>
          </div>
          <div className="flex items-start">
            <LiquidBadge variant="primary" size="sm" className="mr-2 mt-0.5">4</LiquidBadge>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We search Y Combinator, WellFound, and 100+ job boards
            </p>
          </div>
        </div>
      </div>
    </LiquidCard>
  );
}