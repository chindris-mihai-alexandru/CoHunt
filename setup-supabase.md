# Supabase Setup Guide for CoHunt

## 1. Get Your Database URL

1. Go to your Supabase dashboard
2. Click the **"Connect"** button at the top
3. Choose **"Transaction"** mode (best for serverless)
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add `?pgbouncer=true` at the end

## 2. Get Service Role Key

1. In Supabase dashboard, go to Settings → API
2. Copy the "service_role" key (keep this secret!)

## 3. Create .env.local file

Create a `.env.local` file in your project root with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Database
DATABASE_URL=<your-database-url-from-step-1>

# Your existing keys
OPENAI_API_KEY=<your-openai-key>
FIRECRAWL_API_KEY=<your-firecrawl-key>

# App Configuration
NEXT_PUBLIC_FREE_SEARCHES_PER_DAY=3
CRON_SECRET=<generate-random-string>
```

## 4. Enable Email Authentication

1. In Supabase dashboard, go to Authentication → Providers
2. Enable "Email" provider
3. Configure email settings:
   - Enable email confirmations (optional for testing)
   - Set up email templates if needed

## 5. Initialize Database

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with an email
3. Check if the user appears in Supabase dashboard → Authentication → Users

## Troubleshooting

- If you get connection errors, make sure you're using the Transaction pooler URL (port 6543)
- Add `?pgbouncer=true` to your DATABASE_URL
- Check that all environment variables are set correctly
- Ensure email auth is enabled in Supabase 