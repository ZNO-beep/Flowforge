import { useState } from 'react';

/**
 * Custom hook to manage the state for the OrgStructurePage component
 * @returns {Object} State and state management functions
 */
export const useOrgStructurePageState = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddDeptDialogOpen, setIsAddDeptDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Updated stats structure to match the Statistics component
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalRoles: 0,
    totalFunctions: 0,
    averageRolesPerDepartment: 0
  });
  
  const [showStats, setShowStats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  return {
    // Data state
    departments,
    setDepartments,
    allItems,
    setAllItems,
    
    // Loading and error state
    loading,
    setLoading,
    error,
    setError,
    isSubmitting,
    setIsSubmitting,
    
    // Dialog state
    isAddDeptDialogOpen,
    setIsAddDeptDialogOpen,
    isHelpDialogOpen,
    setIsHelpDialogOpen,
    
    // Form state
    newDepartment,
    setNewDepartment,
    
    // Statistics state
    stats,
    setStats,
    showStats,
    setShowStats,
    
    // Search state
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching
  };
}; 