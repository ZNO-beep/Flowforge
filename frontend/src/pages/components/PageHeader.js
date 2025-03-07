import React from 'react';
import PropTypes from 'prop-types';

/**
 * Header component for the OrgStructurePage
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.children - Additional content to render in the header
 * @returns {JSX.Element} Component JSX
 */
const PageHeader = ({
  title,
  description,
  children
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">
          {description}
        </p>
      )}
    </div>
    {children && (
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    )}
  </div>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node
};

export default PageHeader; 