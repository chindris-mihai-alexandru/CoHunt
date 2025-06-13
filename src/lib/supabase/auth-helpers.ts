import { createClient } from './client';

export async function resendConfirmationEmail(email: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) throw error;
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

export async function verifyEmail(token: string, type: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: type as any,
  });

  if (error) throw error;
}