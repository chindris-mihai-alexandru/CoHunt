# CoHunt - Inbound Recruiter Platform 🎯

A modern inbound recruiting platform that helps recruiters build their profile, get discovered by candidates, and automate their outreach with AI-powered matching and email sequences.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

## 🌟 Key Features

### For Recruiters
- **📊 Professional Profile Builder**: Showcase expertise, track record, and specializations
- **🔍 Email Finder & Verification**: Find and verify candidate emails using Apollo.io and Hunter.io
- **🤖 AI-Powered Matching**: Get matched with candidates based on your expertise and open roles
- **📧 Automated Email Sequences**: Set up personalized email campaigns with Resend
- **📈 Analytics Dashboard**: Track open rates, response rates, and placement metrics
- **🌐 Recruiter Discovery**: Get discovered by candidates browsing the recruiter marketplace

### Technical Highlights
- **🔐 Authentication**: Secure user accounts with Supabase Auth
- **💾 Real Database**: PostgreSQL with Prisma ORM for reliable data storage
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS
- **⚡ Performance**: Next.js 15 with modern React patterns
- **🔌 API Integrations**: Apollo.io, Hunter.io, and Resend ready

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Email**: Resend for delivery
- **APIs**: Apollo.io (contacts), Hunter.io (verification)
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
   - Apollo.io API key
   - Hunter.io API key
   - Resend API key

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
│   │   ├── profile/      # Recruiter profile management
│   │   ├── campaigns/    # Email campaign manager
│   │   ├── matches/      # Candidate matching
│   │   ├── analytics/    # Performance dashboard
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   │   ├── api/         # External API integrations
│   │   └── supabase/    # Supabase client setup
│   └── contexts/        # React contexts
├── prisma/              # Database schema
└── public/             # Static assets
```

## 🎯 Core Pages

### Landing Page
- Value proposition for recruiters
- Feature highlights with modern design
- Social proof and conversion-focused CTAs

### Recruiter Profile Builder
- Professional bio and expertise showcase
- Performance statistics and portfolio
- Skills, certifications, and specializations
- Recent placement highlights

### Email Campaign Manager
- Create and manage automated email sequences
- Target specific roles, companies, and skills
- Schedule and track campaign performance
- Email template builder with personalization

### Candidate Matches
- AI-powered candidate recommendations
- Advanced filtering and search
- Email verification and contact info
- Match scoring and reasoning

### Analytics Dashboard
- Email performance metrics
- Campaign analytics and trends
- Top performing skills and placements
- Revenue and conversion tracking

## 🔌 API Integrations

### Apollo.io Integration
```typescript
// Find contacts by company and role
const contacts = await apolloService.searchContacts({
  title: 'Software Engineer',
  company: 'TechCorp',
  location: 'San Francisco',
  limit: 25
});
```

### Hunter.io Integration
```typescript
// Verify email addresses
const verification = await hunterService.verifyEmail('candidate@company.com');
const isRecommended = hunterService.isEmailRecommended(verification);
```

### Resend Integration
```typescript
// Send personalized emails
const result = await resendService.sendEmail({
  to: ['candidate@company.com'],
  from: 'recruiter@company.com',
  subject: 'Exciting Opportunity',
  html: personalizedTemplate
});
```

## 🎨 Design Philosophy

CoHunt follows modern design principles with:
- **Clean, minimal interface** focused on conversion
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

Track key recruiting metrics:
- **Email Performance**: Open rates, response rates, bounce rates
- **Campaign Analytics**: Performance by role, company, location
- **Placement Metrics**: Success rates, time to fill, revenue
- **Profile Performance**: Views, matches, engagement

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
APOLLO_API_KEY=your_apollo_api_key
HUNTER_API_KEY=your_hunter_api_key
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Built with ❤️ for the recruiting community**

Transform your recruiting from outbound to inbound with CoHunt.

---

*Ready to revolutionize your recruiting? Get started today!*