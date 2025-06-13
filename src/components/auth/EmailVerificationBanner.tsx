'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resendConfirmationEmail } from '@/lib/supabase/auth-helpers';
import toast from 'react-hot-toast';

export default function EmailVerificationBanner() {
  const { user, isEmailVerified, unverifiedEmail, clearUnverifiedEmail } = useAuth();
  const [sending, setSending] = useState(false);

  // Show banner if user is logged in but unverified, OR if there's an unverified email from failed login
  const shouldShow = (user && !isEmailVerified) || unverifiedEmail;
  const emailToResend = user?.email || unverifiedEmail;

  if (!shouldShow || !emailToResend) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendConfirmationEmail(emailToResend);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = () => {
    if (unverifiedEmail) {
      clearUnverifiedEmail();
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              Please verify your email address ({emailToResend}) to access all features.
              <button
                onClick={handleResend}
                disabled={sending}
                className="ml-2 font-medium underline hover:no-underline disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Resend verification email'}
              </button>
            </p>
          </div>
        </div>
        {unverifiedEmail && (
          <button
            onClick={handleDismiss}
            className="text-yellow-700 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}