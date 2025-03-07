import mockAiOrgStructure from '../data/mockAiOrgStructure.json';

/**
 * Service for managing organizational structure data
 */
const OrgStructureService = {
  /**
   * Load the organizational structure for a business
   * @param {string} businessId - The business ID
   * @returns {Promise<Object>} The organizational structure
   */
  async loadOrgStructure(businessId) {
    // In a real application, this would fetch from an API or database
    // For now, we'll use the mock data and simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if there's a saved structure in localStorage
        const savedStructure = localStorage.getItem(`orgStructure_${businessId}`);
        
        if (savedStructure) {
          try {
            resolve(JSON.parse(savedStructure));
          } catch (error) {
            console.error('Error parsing saved structure:', error);
            resolve(mockAiOrgStructure);
          }
        } else {
          // Use the mock AI-generated structure
          resolve(mockAiOrgStructure);
        }
      }, 500); // Simulate network delay
    });
  },
  
  /**
   * Save the organizational structure for a business
   * @param {string} businessId - The business ID
   * @param {Object} structure - The organizational structure to save
   * @returns {Promise<boolean>} Whether the save was successful
   */
  async saveOrgStructure(businessId, structure) {
    // In a real application, this would save to an API or database
    // For now, we'll save to localStorage and simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.setItem(`orgStructure_${businessId}`, JSON.stringify(structure));
          resolve(true);
        } catch (error) {
          console.error('Error saving structure:', error);
          resolve(false);
        }
      }, 500); // Simulate network delay
    });
  },
  
  /**
   * Generate an organizational structure using AI
   * @param {Object} businessInfo - Information about the business
   * @returns {Promise<Object>} The generated organizational structure
   */
  async generateOrgStructure(businessInfo) {
    // In a real application, this would call an AI service
    // For now, we'll use the mock data and customize it with the business name
    return new Promise((resolve) => {
      setTimeout(() => {
        const customizedStructure = {
          ...mockAiOrgStructure,
          name: businessInfo.businessName || 'My Company'
        };
        
        resolve(customizedStructure);
      }, 1000); // Simulate AI processing time
    });
  },
  
  /**
   * Validate an organizational structure
   * @param {Object} structure - The organizational structure to validate
   * @returns {boolean} Whether the structure is valid
   */
  validateOrgStructure(structure) {
    // Basic validation
    if (!structure || typeof structure !== 'object') {
      return false;
    }
    
    if (!structure.id || !structure.name || !structure.type) {
      return false;
    }
    
    if (!Array.isArray(structure.children)) {
      return false;
    }
    
    return true;
  }
};

export default OrgStructureService; 