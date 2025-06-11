import React from "react";

interface ApiKeyInfoProps {
  onApiKeySet: (configured: boolean) => void;
}

const ApiKeyInfo: React.FC<ApiKeyInfoProps> = ({ onApiKeySet }) => {
  // Since API keys are now managed server-side, we just inform the user
  React.useEffect(() => {
    onApiKeySet(true); // Always configured on server
  }, [onApiKeySet]);

  return (
    <div className='space-y-6'>
      {/* API Configuration Info */}
      <div className='bg-white rounded-md'>
        <h3 className='text-md font-medium text-gray-900 mb-2'>
          API Configuration
        </h3>
        <div className='space-y-4'>
          <div className='bg-green-50 border border-green-200 rounded-md p-4'>
            <p className='text-sm text-green-800'>
              ✓ API keys are securely configured on the server
            </p>
          </div>
          <p className='text-xs text-gray-600'>
            The Firecrawl and OpenAI API keys are managed securely through server-side
            environment variables. No API keys are stored or transmitted from the client.
          </p>
        </div>
      </div>

      {/* Security Info */}
      <div className='mt-8 pt-4 border-t border-gray-200'>
        <h3 className='text-sm font-medium text-gray-700 mb-2'>
          Security Notice
        </h3>
        <p className='text-xs text-gray-600'>
          For security reasons, API keys are now exclusively managed on the server side.
          This ensures your sensitive credentials are never exposed in the browser or
          client-side code.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInfo;