import { useState, useEffect } from 'react';

/**
 * Custom hook for managing onboarding state
 * @returns {Object} Onboarding state and functions
 */
const useOnboardingState = () => {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved business info from localStorage on mount
  useEffect(() => {
    const savedInfo = localStorage.getItem('businessInfo');
    if (savedInfo) {
      try {
        setBusinessInfo(JSON.parse(savedInfo));
      } catch (error) {
        console.error('Error parsing saved business info:', error);
      }
    }
  }, []);

  // Save business info to localStorage
  const saveBusinessInfo = (info) => {
    try {
      localStorage.setItem('businessInfo', JSON.stringify(info));
      setBusinessInfo(info);
      return true;
    } catch (error) {
      console.error('Error saving business info:', error);
      return false;
    }
  };

  // Validate business info
  const validateBusinessInfo = (info) => {
    const newErrors = {};
    
    if (!info.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!info.businessType) {
      newErrors.businessType = 'Business type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear all business info
  const clearBusinessInfo = () => {
    localStorage.removeItem('businessInfo');
    setBusinessInfo({
      businessName: '',
      businessType: ''
    });
  };

  return {
    businessInfo,
    setBusinessInfo,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    saveBusinessInfo,
    validateBusinessInfo,
    clearBusinessInfo
  };
};

export default useOnboardingState; 