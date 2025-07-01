import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Mock job data for development - replace with real API integration
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
    url: 'https://techcorp.com/jobs/senior-frontend-developer',
    salary: '$120k - $160k',
    type: 'Full-time',
    postedDate: '2 days ago',
    source: 'TechCorp Careers',
    matchScore: 95,
    matchReason: 'Perfect match for your React and TypeScript skills. The role aligns with your experience level and salary expectations.'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    description: 'Join our fast-growing startup as a Full Stack Engineer. Work with Node.js, React, and PostgreSQL to build scalable web applications.',
    url: 'https://wellfound.com/company/startupxyz/jobs/123456',
    salary: '$100k - $140k',
    type: 'Full-time',
    postedDate: '1 day ago',
    source: 'WellFound',
    matchScore: 88,
    matchReason: 'Strong match for full-stack development. Remote work option aligns with your preferences.'
  },
  {
    id: '3',
    title: 'Software Engineer',
    company: 'Y Combinator Startup',
    location: 'New York, NY',
    description: 'Early-stage YC startup looking for a software engineer to help build the next generation of fintech products. Equity package included.',
    url: 'https://www.ycombinator.com/jobs/123',
    salary: '$90k - $130k + equity',
    type: 'Full-time',
    postedDate: '3 hours ago',
    source: 'Y Combinator',
    matchScore: 82,
    matchReason: 'Great opportunity at a YC startup. Equity compensation and growth potential match your career goals.'
  },
  {
    id: '4',
    title: 'React Developer',
    company: 'InnovateCo',
    location: 'Austin, TX',
    description: 'Looking for a React Developer to work on cutting-edge web applications. Experience with hooks, context, and modern React patterns required.',
    url: 'https://indeed.com/viewjob?jk=abc123',
    salary: '$85k - $115k',
    type: 'Full-time',
    postedDate: '1 week ago',
    source: 'Indeed',
    matchScore: 78,
    matchReason: 'Good match for React specialization. Salary range fits your expectations.'
  },
  {
    id: '5',
    title: 'Frontend Engineer',
    company: 'TechGiant',
    location: 'Seattle, WA',
    description: 'Join our frontend team to build world-class user experiences. Work with React, Vue.js, and cutting-edge web technologies at scale.',
    url: 'https://linkedin.com/jobs/view/987654321',
    salary: '$140k - $180k',
    type: 'Full-time',
    postedDate: '5 days ago',
    source: 'LinkedIn',
    matchScore: 91,
    matchReason: 'Excellent match for frontend expertise. High compensation and opportunity to work at scale.'
  }
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get user if authenticated (optional for job search)
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const { query, location, jobType, hasResume } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter mock jobs based on search criteria
    let filteredJobs = mockJobs.filter(job => {
      const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase()) ||
                          job.description.toLowerCase().includes(query.toLowerCase()) ||
                          job.company.toLowerCase().includes(query.toLowerCase());
      
      const matchesLocation = !location || 
                             job.location.toLowerCase().includes(location.toLowerCase()) ||
                             job.location.toLowerCase() === 'remote';
      
      const matchesType = !jobType || 
                         job.type.toLowerCase().includes(jobType.toLowerCase()) ||
                         (jobType === 'remote' && job.location.toLowerCase() === 'remote');

      return matchesQuery && matchesLocation && matchesType;
    });

    // Sort by match score if available
    filteredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // If user uploaded resume, boost match scores
    if (hasResume && user) {
      filteredJobs = filteredJobs.map(job => ({
        ...job,
        matchScore: Math.min(100, (job.matchScore || 70) + 10),
        matchReason: job.matchReason + ' Enhanced matching based on your resume analysis.'
      }));
    }

    // Log search for analytics (if user is authenticated)
    if (user) {
      try {
        await supabase.from('searches').insert({
          userId: user.id,
          query,
          location,
          jobType,
        });
      } catch (error) {
        console.error('Failed to log search:', error);
        // Don't fail the request if logging fails
      }
    }

    const response = {
      jobs: filteredJobs,
      totalFound: filteredJobs.length,
      searchTime: Math.floor(Math.random() * 500) + 200, // Mock search time
      sources: ['Y Combinator', 'WellFound', 'Indeed', 'LinkedIn', 'Company Careers'],
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Job search API is working',
    timestamp: new Date().toISOString(),
    availableSources: [
      'Y Combinator Jobs',
      'WellFound (AngelList)',
      'Indeed',
      'LinkedIn',
      'Company Career Pages',
      'Startup Job Boards'
    ]
  });
}