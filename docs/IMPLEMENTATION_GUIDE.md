# Implementation Guide for Pending Features

## 1. Email Service Integration (Resend)

### Setup Steps:
1. Create account at https://resend.com
2. Get API key
3. Install Resend SDK: `npm install resend`
4. Update Supabase Auth settings

### Code Implementation:
```typescript
// lib/email/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'CoHunt <noreply@cohunt.app>',
    to: email,
    subject: 'Welcome to CoHunt!',
    html: `<h1>Welcome ${name}!</h1><p>Start finding your dream job today.</p>`
  });
}
```

### Supabase Configuration:
- Go to Authentication → Email Templates
- Update SMTP settings with Resend credentials
- Customize email templates

## 2. Firecrawl API Integration

### Current Issue:
The `/api/search-jobs/route.ts` creates mock jobs instead of using real Firecrawl API.

### Fix Implementation:
```typescript
// Update src/app/api/search-jobs/route.ts
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

// Replace mock jobs with:
const searchResults = await firecrawl.search(query, {
  limit: 20,
  scrapeOptions: {
    formats: ['markdown', 'html'],
  }
});
```

### Environment Variables Needed:
```env
FIRECRAWL_API_KEY=your_api_key_here
RESEND_API_KEY=your_resend_key_here
```

## 3. Buy Me A Coffee Integration

### Footer Component:
```tsx
// components/BuyMeACoffee.tsx
export function BuyMeACoffee() {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-600 mb-2">
        Help us keep the job data fresh!
      </p>
      <a 
        href="https://www.buymeacoffee.com/cohunt" 
        target="_blank"
        rel="noopener noreferrer"
      >
        <img 
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
          alt="Buy Me A Coffee" 
          className="h-12 mx-auto"
        />
      </a>
    </div>
  );
}
```

### Add to Layout:
```tsx
// src/app/layout.tsx
import { BuyMeACoffee } from '@/components/BuyMeACoffee';

// Add to footer section
<footer className="border-t">
  <BuyMeACoffee />
</footer>
```

## Priority Order:
1. **Firecrawl Integration** - Critical for core functionality
2. **Email Service** - Important for user experience
3. **Donations** - Nice to have for sustainability

## Testing Checklist:
- [ ] Job search returns real results
- [ ] Email confirmation works
- [ ] Buy Me A Coffee button displays correctly
- [ ] All environment variables are set
- [ ] Error handling works properly