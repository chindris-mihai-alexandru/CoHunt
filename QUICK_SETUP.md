# Quick Setup Guide

Since you already have email authentication enabled in Supabase, here are the remaining steps:

## 1. Update your .env.local file

Add these Supabase credentials to your existing .env.local file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Database - Replace with your actual database URL
DATABASE_URL=<your-database-url>

# App Configuration (add these if not already present)
NEXT_PUBLIC_FREE_SEARCHES_PER_DAY=3
CRON_SECRET=<generate-a-secure-random-string>
```

## 2. Push the database schema

```bash
npx prisma db push
```

## 3. Apply Row Level Security policies

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `supabase-rls-policies.sql`
3. Run the query

## 4. Test the connection

```bash
node test-supabase-connection.js
```

## 5. Start the development server

```bash
npm run dev
```

## That's it! 🎉

Your app should now be running with:
- Supabase authentication (email login/signup)
- PostgreSQL database
- Real job scraping from Indeed
- All existing features maintained 