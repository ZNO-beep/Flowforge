import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card header component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card title component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Card footer component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}; 