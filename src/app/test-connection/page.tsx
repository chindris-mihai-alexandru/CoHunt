import TestConnectionClient from '../api/test-connection/client';

export default function TestConnectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supabase Connection Test</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            This page tests the connection to your Supabase database
          </p>
        </div>
        
        <TestConnectionClient />
      </div>
    </div>
  );
}