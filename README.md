# CoHunt - AI-Powered Job Search Platform 🎯

A modern job search platform that helps job seekers find their dream jobs using AI-powered matching, smart resume tailoring, and connections with specialized recruiters.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

## 🌟 Key Features

### For Job Seekers
- **🔍 AI-Powered Job Matching**: Get matched with jobs that perfectly fit your skills and experience
- **📄 Smart Resume Tailoring**: Automatically customize your resume for each job application
- **📊 Application Tracking**: Track all your applications, interviews, and follow-ups in one place
- **📧 Communication Management**: AI-powered email templates and follow-up reminders
- **👥 Recruiter Discovery**: Connect with specialized recruiters who focus on your industry
- **🌐 Social Intelligence**: Leverage LinkedIn and other platform insights to optimize your networking

### Technical Highlights
- **🔐 Authentication**: Secure user accounts with Supabase Auth
- **💾 Real Database**: PostgreSQL with Prisma ORM for reliable data storage
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS
- **⚡ Performance**: Next.js 15 with modern React patterns
- **🔌 API Integrations**: Firecrawl for job scraping, OpenAI for matching and analysis

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Job Search**: Firecrawl API for scraping job listings from multiple sources
- **AI Matching**: OpenAI for resume analysis and job matching
- **Deployment**: Vercel-ready

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cohunt.git
   cd cohunt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys:
   - Supabase credentials
   - OpenAI API key
   - Firecrawl API key

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 💡 Architecture

```
cohunt/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── jobs/         # Job search and matching
│   │   ├── applications/ # Application tracking
│   │   ├── resume-builder/# Resume tailoring
│   │   ├── recruiters/   # Recruiter discovery
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   │   ├── jobs/        # Job search and matching services
│   │   ├── resume/      # Resume tailoring utilities
│   │   ├── communication/# Email and messaging utilities
│   │   ├── social-intelligence/# Social platform analysis
│   │   └── supabase/    # Supabase client setup
│   └── contexts/        # React contexts
├── prisma/              # Database schema
└── public/             # Static assets
```

## 🎯 Core Features

### Job Search & Matching
- AI-powered job matching across multiple platforms
- Personalized job recommendations based on skills and preferences
- Comprehensive search across LinkedIn, Indeed, Y Combinator, Wellfound, and niche job boards
- Smart filtering by location, salary, experience level, and more

### Resume Builder & Tailoring
- AI-powered resume analysis and optimization
- Automatic keyword matching with job descriptions
- ATS-friendly formatting suggestions
- Multiple resume versions for different job types

### Application Tracking
- Centralized dashboard for all applications
- Status tracking (applied, screening, interview, offer, rejected)
- Interview scheduling and preparation
- Follow-up reminders and communication history

### Communication Management
- Email templates for different application stages
- Follow-up timing recommendations
- Communication history tracking
- Integration with email providers

### Recruiter Discovery
- Find specialized recruiters in your field
- View recruiter performance metrics and placement history
- Direct messaging and connection features
- Recruiter ratings and reviews

## 🔌 API Integrations

### Firecrawl Integration
```typescript
// Find jobs across multiple platforms
const jobs = await firecrawlService.searchJobs({
  query: 'frontend developer',
  location: 'remote',
  sources: ['linkedin', 'indeed', 'ycombinator', 'wellfound', 'remoteok']
});
```

### OpenAI Integration
```typescript
// Calculate job match score
const matchResult = await openaiService.calculateJobMatch({
  resume: userResume,
  jobDescription: job.description,
  requirements: job.requirements
});
```

## 🎨 Design Philosophy

CoHunt follows modern design principles with:
- **Clean, minimal interface** focused on usability
- **Apple-level design aesthetics** with attention to detail
- **Responsive design** that works on all devices
- **Consistent color system** with proper contrast ratios
- **Thoughtful animations** and micro-interactions
- **Progressive disclosure** to manage complexity

## 🔒 Security & Privacy

- **Row Level Security (RLS)** on all database tables
- **Email verification** required for account activation
- **API key management** through environment variables
- **Rate limiting** on API endpoints
- **GDPR compliance** considerations built-in

## 📊 Analytics & Metrics

Track key job search metrics:
- **Application Performance**: Response rates, interview rates, offer rates
- **Job Match Quality**: Match scores, application success by match score
- **Resume Performance**: Keyword match rates, ATS simulation scores
- **Communication Metrics**: Response times, follow-up effectiveness

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to a Git repository
2. Import your project to Vercel
3. Set up environment variables in the Vercel dashboard
4. Your app will be deployed to a production URL

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_postgresql_connection_string

# API Keys
OPENAI_API_KEY=your_openai_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Create a new branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Built with ❤️ for job seekers**

Transform your job search with CoHunt's AI-powered platform.

---

*Ready to find your dream job? Get started today!*