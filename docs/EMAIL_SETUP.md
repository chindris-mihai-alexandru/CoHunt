# Email Confirmation Setup Guide

This guide explains how to configure email confirmation for the CoHunt app using Supabase's built-in email service.

## What's Been Implemented

1. **Email Verification Flow**
   - Users must verify their email before they can sign in
   - Verification banner shows for unverified users
   - Resend verification email functionality

2. **Password Reset**
   - "Forgot password?" link in login modal
   - Password reset page at `/auth/reset-password`
   - Email sent with reset link

3. **Components Added**
   - `EmailVerificationBanner` - Shows when user hasn't verified email
   - `auth-helpers.ts` - Helper functions for email operations
   - Password reset page

## Supabase Dashboard Configuration

To enable email confirmation in your Supabase project:

### 1. Enable Email Confirmation

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Under **Email**, ensure "Enable Email Confirmations" is turned ON

### 2. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup** - Sent when user signs up
   - **Reset password** - Sent when user requests password reset
   - **Magic Link** - If you enable passwordless login

Default templates work fine, but you can customize them with your brand.

### 3. Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Set the following URLs:
   - **Site URL**: `http://localhost:3000` (or your production URL)
   - **Redirect URLs**: Add `http://localhost:3000/auth/reset-password`

### 4. SMTP Configuration (Optional)

By default, Supabase uses their built-in email service which:
- Sends from `noreply@mail.app.supabase.io`
- Has a limit of 3 emails per hour for free projects
- Is sufficient for development and small projects

For production with higher volume:
1. Go to **Project Settings** → **Auth**
2. Under **SMTP Settings**, enable "Custom SMTP"
3. Configure with your SMTP provider (SendGrid, Mailgun, etc.)

## Testing the Email Flow

1. **Sign Up**
   ```
   - Create a new account
   - Check email for verification link
   - Click link to verify
   - Try signing in
   ```

2. **Password Reset**
   ```
   - Click "Forgot password?" on login
   - Enter email
   - Check email for reset link
   - Click link and set new password
   ```

3. **Resend Verification**
   ```
   - Sign up but don't verify
   - Sign in to see verification banner
   - Click "Resend verification email"
   ```

## Troubleshooting

### Emails Not Sending
- Check Supabase dashboard for email logs
- Verify email confirmations are enabled
- Check you haven't hit the rate limit (3/hour on free tier)

### Invalid Reset Link
- Ensure redirect URL is configured in Supabase
- Check that the reset password page path matches

### Email Lands in Spam
- This is common with default Supabase emails
- Configure custom SMTP with proper domain for production

## Production Recommendations

1. **Custom SMTP**: Set up SendGrid, Mailgun, or similar for better deliverability
2. **Custom Domain**: Use your own domain for sending emails
3. **Email Templates**: Customize templates to match your brand
4. **Rate Limiting**: Implement rate limiting for email requests
5. **Monitoring**: Set up email delivery monitoring

## Environment Variables

No additional environment variables needed for basic Supabase email service. For custom SMTP, you'll need:

```env
# Custom SMTP (if using)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-api-key
SMTP_FROM=noreply@cohunt.com
```

Configure these in Supabase Dashboard under SMTP settings, not in your `.env` file.