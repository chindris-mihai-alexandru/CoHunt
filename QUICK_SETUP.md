# Quick Setup Guide

Since you already have email authentication enabled in Supabase, here are the remaining steps:

## 1. Update your .env.local file

Add these Supabase credentials to your existing .env.local file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ibqvjblerlrbxxjvfkmz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicXZqYmxlcmxyYnh4anZma216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjE5MjEsImV4cCI6MjA2NTI5NzkyMX0.6OfJ3eo3PVlgjQTFcUmoBVEnCTLbZVyc_8QkpFxwbpI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicXZqYmxlcmxyYnh4anZma216Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTcyMTkyMSwiZXhwIjoyMDY1Mjk3OTIxfQ.Cb_CXv7BsNYzKeVB7dh1TK4YQ5I_xH6sB8gmMgzAuGA

# Database - Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL=postgresql://postgres.ibqvjblerlrbxxjvfkmz:[YOUR-PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# App Configuration (add these if not already present)
NEXT_PUBLIC_FREE_SEARCHES_PER_DAY=3
CRON_SECRET=cohunt_cron_secret_2024
```

## 2. Push the database schema

```bash
npx prisma db push
```

## 3. Apply Row Level Security policies

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/ibqvjblerlrbxxjvfkmz/sql
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