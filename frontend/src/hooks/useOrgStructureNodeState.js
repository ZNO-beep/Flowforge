import { useState } from 'react';

/**
 * Custom hook to manage the state for the OrgStructureNode component
 * @returns {Object} State and state management functions
 */
export const useOrgStructureNodeState = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return {
    showTooltip,
    setShowTooltip
  };
}; 