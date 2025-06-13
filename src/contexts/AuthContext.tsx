'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isPremium: boolean;
  searchesRemaining: number;
  refreshUserData: () => Promise<void>;
  isEmailVerified: boolean;
  unverifiedEmail: string | null;
  clearUnverifiedEmail: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [searchesRemaining, setSearchesRemaining] = useState(10);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/user-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsPremium(data.isPremium);
        setSearchesRemaining(data.searchesRemaining);
        console.log(`Search count debug: searchesRemaining=${data.searchesRemaining}, searchCount=${data.searchCount}, isPremium=${data.isPremium}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to default values
      const dailyLimit = parseInt(process.env.NEXT_PUBLIC_FREE_SEARCHES_PER_DAY || '10');
      setSearchesRemaining(dailyLimit);
    }
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsEmailVerified(session.user.email_confirmed_at !== null);
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsEmailVerified(session.user.email_confirmed_at !== null);
        fetchUserData(session.user.id);
      } else {
        setIsPremium(false);
        const dailyLimit = parseInt(process.env.NEXT_PUBLIC_FREE_SEARCHES_PER_DAY || '10');
        setSearchesRemaining(dailyLimit);
        setIsEmailVerified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData, supabase]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if email is verified
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      setUnverifiedEmail(email); // Store email for banner
      throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
    }

    // Clear unverified email on successful login
    setUnverifiedEmail(null);
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    // Create user record in database
    if (data.user) {
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name,
      });
      
      if (insertError) {
        console.error('Error creating user record:', insertError);
        // Don't throw error here as user is already created in auth
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const clearUnverifiedEmail = () => {
    setUnverifiedEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isPremium,
        searchesRemaining,
        refreshUserData,
        isEmailVerified,
        unverifiedEmail,
        clearUnverifiedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 