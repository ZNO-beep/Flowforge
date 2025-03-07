import React from 'react';
import PropTypes from 'prop-types';

/**
 * Textarea component for multiline text input
 * @param {Object} props - Component props
 * @param {string} props.id - ID of the textarea
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of rows
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Textarea = React.forwardRef(({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      id={id}
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string
};

export default Textarea; 