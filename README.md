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

## 🎯 Roadmap

- [x] AI-powered job matching
- [x] Resume upload and parsing
- [x] User authentication
- [x] Real job data integration
- [x] Freemium monetization model
- [ ] Email notifications for job alerts
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] API for third-party integrations

## 🤝 Contributing

This project is currently under active development. Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💖 Support the Project

<a href="https://www.buymeacoffee.com/your-username" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

### Why Donate?

CoHunt relies on several paid APIs to deliver real-time job matching:
- **Firecrawl API**: Powers our job scraping engine to find the latest opportunities
- **OpenAI API**: Provides AI-powered resume matching and analysis
- **Email Services**: Ensures reliable delivery of job alerts and notifications

Your donations help us:
- 🔍 Keep job data fresh and accurate with continuous API calls
- 🚀 Maintain and improve the platform
- 💡 Develop new features requested by the community
- 🌍 Keep the service free for job seekers who need it most

**Monthly API Costs**: ~$150-300 depending on usage

Every coffee helps us serve more job seekers! ☕

## 👨‍💻 Developer

**Mihai-Alexandru Chindris**
- GitHub: [@chindris-mihai-alexandru](https://github.com/chindris-mihai-alexandru)
- LinkedIn: https://www.linkedin.com/in/mihai-chindris/

---

Built with ❤️ using Next.js, TypeScript, and AI
