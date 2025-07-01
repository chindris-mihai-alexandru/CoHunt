# CoHunt - AI-Powered Job Search Platform 🎯

A modern job search platform that leverages AI to match candidates with opportunities from top companies, startups, and the hidden job market. Built with Next.js, Supabase, and powered by advanced job scraping technology.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

## 🌟 Key Features

### For Job Seekers
- **🤖 AI-Powered Job Matching**: Advanced algorithms analyze your skills and preferences to find perfect matches
- **🚀 Startup Job Boards**: Access exclusive opportunities from Y Combinator, WellFound (AngelList), and other startup platforms
- **🔍 Hidden Job Market**: Discover unadvertised positions through company research and network analysis
- **📄 Resume Analysis**: Upload your resume for personalized job matching and skill gap analysis
- **⚡ Real-time Search**: Live scraping ensures you see the latest opportunities as they're posted
- **🔔 Smart Job Alerts**: Get notified instantly when new jobs match your criteria

### Technical Highlights
- **🔐 Authentication**: Secure user accounts with Supabase Auth and email verification
- **💾 Real Database**: PostgreSQL with Prisma ORM for reliable data storage
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS that works on all devices
- **⚡ Performance**: Next.js 15 with modern React patterns and optimizations
- **🔌 API Integrations**: Firecrawl for job scraping, OpenAI for AI matching

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with email verification
- **Job Scraping**: Firecrawl API for real-time job data
- **AI Matching**: OpenAI for intelligent job matching
- **Deployment**: Vercel-ready with automatic deployments

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
   - Firecrawl API key
   - OpenAI API key

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
│   │   ├── api/          # API routes for job search, auth, etc.
│   │   ├── dashboard/    # User dashboard
│   │   ├── profile/      # User profile management
│   │   └── auth/         # Authentication pages
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   └── ui/           # Reusable UI components
│   ├── lib/             # Utilities and configurations
│   │   ├── api/         # External API integrations
│   │   └── supabase/    # Supabase client setup
│   └── contexts/        # React contexts
├── prisma/              # Database schema and migrations
└── public/             # Static assets
```

## 🎯 Core Features

### Job Search Engine
- **Multi-source Aggregation**: Searches across Y Combinator, WellFound, Indeed, LinkedIn, and company career pages
- **Real-time Scraping**: Uses Firecrawl API to get the latest job postings
- **Smart Filtering**: Advanced filters for location, job type, salary, and experience level
- **AI Matching**: OpenAI-powered matching with detailed explanations

### User Experience
- **Resume Upload**: PDF parsing for enhanced job matching
- **Job Alerts**: Email notifications for new matching opportunities
- **Saved Jobs**: Bookmark interesting positions for later review
- **Application Tracking**: Track your job applications and their status

### Data Sources
- **Y Combinator Jobs**: Direct access to startup opportunities
- **WellFound (AngelList)**: Startup and tech company positions
- **Indeed**: Traditional job board with millions of listings
- **LinkedIn**: Professional network job postings
- **Company Career Pages**: Direct from company websites
- **Hidden Job Market**: Unadvertised positions through network analysis

## 🔌 API Integrations

### Firecrawl Integration
```typescript
// Real-time job scraping
const jobs = await firecrawlService.searchJobs({
  query: 'software engineer',
  sources: ['ycombinator', 'wellfound', 'indeed'],
  location: 'San Francisco'
});
```

### OpenAI Integration
```typescript
// AI-powered job matching
const matches = await openaiService.matchJobs(userProfile, jobListings);
```

## 🔒 Security & Privacy

- **Row Level Security (RLS)** on all database tables
- **Email verification** required for account activation
- **API key management** through environment variables
- **Rate limiting** on API endpoints
- **GDPR compliance** considerations built-in

## 📊 Analytics & Metrics

Track key job search metrics:
- **Search Performance**: Query success rates, response times
- **Job Discovery**: Sources, match accuracy, application rates
- **User Engagement**: Search frequency, saved jobs, applications
- **Market Insights**: Trending skills, salary ranges, locations

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

# APIs
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
FREE_SEARCHES_PER_DAY=10
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

- **Main Branch**: Production-ready code
- **Bolt Branch**: Development and feature integration
- **Feature Branches**: Individual feature development

The GitHub Actions workflow automatically syncs branches and handles deployments.

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] Job search engine with multiple sources
- [x] User authentication and profiles
- [x] AI-powered job matching
- [x] Resume upload and analysis

### Phase 2: Enhanced Features 🚧
- [ ] Advanced job alerts and notifications
- [ ] Application tracking system
- [ ] Salary insights and negotiation tools
- [ ] Company research and insights

### Phase 3: Premium Features 🔮
- [ ] Premium job sources and exclusive listings
- [ ] Career coaching and interview prep
- [ ] Networking and referral system
- [ ] Advanced analytics and insights

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Built with ❤️ for job seekers everywhere**

Transform your job search with AI-powered matching and access to the hidden job market.

---

*Ready to find your dream job? Get started today!*