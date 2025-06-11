import React from "react";
import ReusableSidebar from "./ReusableSidebar";
import ApiKeyInfo from "./ApiKeyInfo";
import { Settings } from "lucide-react";

interface ApiKeySidebarProps {
  onApiKeySet: (configured: boolean) => void;
  apiKeysConfigured: boolean;
}

const ApiKeySidebar: React.FC<ApiKeySidebarProps> = ({
  onApiKeySet,
  apiKeysConfigured,
}) => {
  return (
    <ReusableSidebar
      title='API Configuration'
      subtitle='Server-side API management'
      buttonIcon={<Settings size={24} />}
      buttonLabel='Toggle API Info'
      isConfigured={true} // Always configured on server
      statusText={{
        configured: "APIs Configured ✓",
        notConfigured: "Configure APIs",
      }}
      headerClassName='bg-gradient-to-r from-orange-500 to-orange-600'>
      <ApiKeyInfo onApiKeySet={onApiKeySet} />
    </ReusableSidebar>
  );
};

export default ApiKeySidebar;
