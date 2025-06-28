# CoHunt - AI-Powered Job Matching Platform 🚀

An intelligent job search platform that uses AI to match candidates with their perfect opportunities, featuring real-time job scraping, personalized match scores, and a freemium SaaS model.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)

## 🌟 Key Features

### For Job Seekers
- **🤖 AI-Powered Matching**: Upload your resume and get personalized match scores for every job
- **🔍 Real-Time Job Search**: Live job data from multiple sources (Indeed, LinkedIn, etc.)
- **📊 Smart Analytics**: Track applications, view market trends, and optimize your job search
- **💼 Resume Analysis**: AI evaluates your resume against job requirements
- **🎯 Location-Aware**: Find jobs in your area with accurate salary data (including ISK for Iceland)

### Technical Highlights
- **🔐 Authentication**: Secure user accounts with Supabase Auth
- **💾 Real Database**: PostgreSQL with Prisma ORM for reliable data storage
- **🚦 Rate Limiting**: Free tier (3 searches/day) vs Premium (unlimited)
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS
- **⚡ Performance**: Next.js 15 with Turbopack for blazing-fast development

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **AI/ML**: OpenAI GPT-4 for matching, Firecrawl for web scraping
- **Deployment**: Vercel-ready

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/chindris-mihai-alexandru/CoHunt.git
   cd cohunt-app
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
   - Database URL

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
cohunt-app/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   │   ├── supabase/    # Supabase client setup
│   │   ├── jobs/        # Job scraping logic
│   │   └── prisma/      # Database client
│   └── types/           # TypeScript definitions
├── prisma/              # Database schema
└── public/             # Static assets
```

## 🎯 Development Roadmap

### ✅ Completed Features
- AI-powered job matching with OpenAI GPT-4
- Resume upload and parsing
- User authentication with Supabase
- Real job data integration with Firecrawl
- Freemium monetization model (3 searches/day free)
- PostgreSQL database with Prisma ORM
- Responsive Next.js 15 interface

### 🚧 In Progress

#### Email Confirmation System 📧
- Set up Resend for transactional emails
- Implement email templates (welcome, confirmation, password reset)
- Configure Supabase Auth to use Resend SMTP
- Add email verification flow to signup process

#### Live Job Search Integration 🔍
- Implement real Firecrawl API integration
- Add error handling and rate limiting
- Cache job results to minimize API calls
- Add fallback to database for recent searches

### 🔮 Upcoming Features

#### Platform Monetization ☕
- Buy Me A Coffee widget integration
- Dedicated "Support Us" page
- Donation progress bar showing API costs coverage
- Transparency dashboard with real-time API usage stats

#### Q2-Q3 2025
- **Mobile app** (React Native)
- **Browser extension** for quick job saves
- **AI-powered cover letter generation**
- **Interview preparation assistant**
- **Company reviews integration**
- **Salary insights and negotiation tips**

#### Technical Improvements
- Comprehensive test suite
- Proper logging and monitoring
- CI/CD pipeline
- API rate limiting per user
- Job alert notifications

### 🌩️ Cloud Infrastructure Migration

**Status**: Planning Phase | **Timeline**: After core features are stable

See [Cloud Implementation Roadmap](docs/CLOUD_IMPLEMENTATION_ROADMAP.md) for detailed plans:
- AWS Activate application strategy ($1K-$100K credits)
- Serverless architecture with AWS Lambda
- CDN implementation for global performance
- Microservices migration path

### 💰 Monthly Operating Costs
- **Firecrawl API**: $50-200 (usage-based)
- **Supabase**: $25 (Pro tier)
- **Resend Email**: $20 (10k emails/month)
- **Vercel Hosting**: $20 (Pro tier)
- **Total**: ~$115-265/month

## 🤝 Contributing

This project is currently under active development. Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Mihai-Alexandru Chindris**
- GitHub: [@chindris-mihai-alexandru](https://github.com/chindris-mihai-alexandru)
- LinkedIn: https://www.linkedin.com/in/mihai-chindris/

---

Built with ❤️ using Next.js, TypeScript, and AI
