'use client';

import { useState } from 'react';

export default function TestConnectionClient() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Test Supabase Connection</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            Status: {result.success ? (
              <span className="text-green-600">Success</span>
            ) : (
              <span className="text-red-600">Failed</span>
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{result.message}</p>
          
          {result.data && (
            <div className="mt-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">User count: {result.data.userCount}</p>
              <p className="text-gray-600 dark:text-gray-400">Timestamp: {result.data.timestamp}</p>
            </div>
          )}
          
          {result.error && (
            <p className="mt-2 text-red-600">{result.error}</p>
          )}
          
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded overflow-auto">
            <pre className="text-xs text-gray-800 dark:text-gray-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}