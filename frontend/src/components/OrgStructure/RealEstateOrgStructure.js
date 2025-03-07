import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * RealEstateOrgStructure component for displaying a pre-populated organizational structure
 * for a real estate agency.
 * @param {Object} props - Component props
 * @param {Function} props.onStructureReady - Callback when structure is ready
 * @returns {JSX.Element} Component JSX
 */
const RealEstateOrgStructure = ({ onStructureReady }) => {
  // Define the real estate agency organizational structure
  const realEstateDepartments = [
    {
      id: 'root',
      name: 'Prestige Real Estate',
      description: 'Real Estate Agency',
      roles: [
        {
          id: 'sales',
          name: 'Sales',
          description: 'Sales Department',
          functions: [
            {
              id: 'lead-generation',
              name: 'Lead Generation',
              description: 'Generate new seller and buyer leads'
            },
            {
              id: 'lead-qualification',
              name: 'Lead Qualification',
              description: 'Qualify and score leads'
            },
            {
              id: 'lead-conversion',
              name: 'Lead Conversion',
              description: 'Convert leads to clients',
              highlighted: true
            }
          ]
        },
        {
          id: 'marketing',
          name: 'Marketing',
          description: 'Marketing Department',
          functions: [
            {
              id: 'content-creation',
              name: 'Content Creation',
              description: 'Create marketing content'
            },
            {
              id: 'social-media',
              name: 'Social Media',
              description: 'Manage social media presence'
            }
          ]
        },
        {
          id: 'finance',
          name: 'Finance',
          description: 'Finance Department',
          functions: [
            {
              id: 'accounting',
              name: 'Accounting',
              description: 'Manage accounting and bookkeeping'
            },
            {
              id: 'commission',
              name: 'Commission',
              description: 'Handle agent commissions'
            }
          ]
        },
        {
          id: 'legal',
          name: 'Legal',
          description: 'Legal Department',
          functions: [
            {
              id: 'contracts',
              name: 'Contracts',
              description: 'Manage contracts and agreements'
            },
            {
              id: 'compliance',
              name: 'Compliance',
              description: 'Ensure regulatory compliance'
            }
          ]
        }
      ]
    }
  ];

  // When the component mounts, notify the parent that the structure is ready
  useEffect(() => {
    if (onStructureReady) {
      onStructureReady(realEstateDepartments);
    }
  }, [onStructureReady]);

  return null; // This component doesn't render anything, it just provides data
};

RealEstateOrgStructure.propTypes = {
  onStructureReady: PropTypes.func
};

export default RealEstateOrgStructure; 