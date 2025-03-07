import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Checkbox component
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onCheckedChange - Function called when checked state changes
 * @param {string} props.id - Checkbox ID
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 * @returns {JSX.Element} Component JSX
 */
export const Checkbox = forwardRef(({
  checked = false,
  onCheckedChange,
  id,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${checked ? 'bg-primary text-primary-foreground' : 'border-primary'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      >
        {checked && (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
          >
            <path
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        )}
      </label>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}; 