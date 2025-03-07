import React from 'react';
import PropTypes from 'prop-types';

/**
 * Separator component for visual separation
 * @param {Object} props - Component props
 * @param {string} props.orientation - Orientation of the separator (horizontal or vertical)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Separator = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`shrink-0 bg-border ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className}`}
      {...props}
    />
  );
};

Separator.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
}; 