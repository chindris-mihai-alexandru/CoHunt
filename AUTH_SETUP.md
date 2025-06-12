# CoHunt Authentication & Database Setup Guide

## Overview

This guide will help you set up authentication and database for CoHunt on the cursor branch.

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account (free tier is fine)
3. OpenAI API key (existing)
4. Firecrawl API key (existing)

## Step 1: Install Dependencies

```bash
# Install all required packages
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs
npm install @prisma/client prisma
npm install axios cheerio node-cron
npm install react-hot-toast
npm install --save-dev @types/node
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy your project URL and anon key
4. Go to Authentication > Providers
5. Enable Email authentication

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (from Supabase Settings > Database)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Existing API Keys
OPENAI_API_KEY=your_existing_openai_key
FIRECRAWL_API_KEY=your_existing_firecrawl_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
FREE_SEARCHES_PER_DAY=3
CRON_SECRET=any_random_string_for_cron_auth
```

## Step 4: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 5: Set Up Supabase Tables

The Prisma migration will create most tables, but you need to enable Row Level Security (RLS) in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. For each table (users, jobs, searches, etc.), click on the table
4. Go to RLS policies
5. Enable RLS
6. Add appropriate policies (examples below)

### Example RLS Policies

For the `users` table:
```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);
```

For the `searches` table:
```sql
-- Users can view their own searches
CREATE POLICY "Users can view own searches" ON searches
FOR SELECT USING (auth.uid() = userId);

-- Users can create searches
CREATE POLICY "Users can create searches" ON searches
FOR INSERT WITH CHECK (auth.uid() = userId);
```

## Step 6: Test the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Click "Sign Up Free" to create an account
   - Check your email for verification (if enabled)
   - Sign in with your credentials

3. Test job search:
   - Search for jobs (you'll see real scraped jobs)
   - Note: First search might be slow as it scrapes fresh data
   - Free users are limited to 3 searches per day

4. Test dashboard:
   - Click "Dashboard" to see your stats
   - View search history and saved jobs

## Step 7: Set Up Cron Job (Production)

For production, set up a daily cron job to update jobs:

### Vercel Cron (if deploying to Vercel)

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/update-jobs",
    "schedule": "0 2 * * *"
  }]
}
```

### Other Platforms

Use their respective cron/scheduled function features to call:
```
GET https://your-domain.com/api/cron/update-jobs
Authorization: Bearer your_cron_secret
```

## Troubleshooting

### "Cannot find module" errors

If you see TypeScript errors about missing modules, run:
```bash
npm install
npx prisma generate
```

### Database connection issues

1. Check your DATABASE_URL is correct
2. Ensure your Supabase project is active
3. Check if you're behind a firewall that blocks PostgreSQL

### Authentication not working

1. Verify your Supabase URL and keys are correct
2. Check if email authentication is enabled in Supabase
3. Look for errors in browser console

### Jobs not appearing

1. The first search will trigger scraping (might take 10-30 seconds)
2. Check browser console for errors
3. Verify your database has the jobs table

## Next Steps

1. **Implement Stripe payments** for premium subscriptions
2. **Add more job sources** (LinkedIn, Glassdoor, etc.)
3. **Improve job matching** algorithm
4. **Add email notifications** for job alerts
5. **Implement saved searches** feature

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│   Supabase     │────▶│  PostgreSQL DB  │
│                 │     │   Auth + API    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                                │
         │                                                │
         ▼                                                ▼
┌─────────────────┐                              ┌─────────────────┐
│                 │                              │                 │
│  Job Scraper    │                              │   Prisma ORM    │
│  (Indeed, etc)  │                              │                 │
└─────────────────┘                              └─────────────────┘
```

## Security Considerations

1. **Never commit `.env.local`** - It's already in .gitignore
2. **Use RLS policies** - Protect your database
3. **Validate user input** - Already implemented in API routes
4. **Rate limiting** - Free tier limits help prevent abuse
5. **CORS settings** - Configure in production

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server-side errors
3. Verify all environment variables are set
4. Ensure all dependencies are installed

Happy coding! 🚀 