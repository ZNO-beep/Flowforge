import React from 'react';
import PropTypes from 'prop-types';

/**
 * Label component for form inputs
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - ID of the input element this label is for
 * @param {React.ReactNode} props.children - Label content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Label = ({ htmlFor, children, className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

export default Label; 