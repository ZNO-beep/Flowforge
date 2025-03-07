import React, { createContext, useContext, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

// Create context for select state
const SelectContext = createContext(null);

/**
 * Select root component
 * @param {Object} props - Component props
 * @param {string} props.value - Selected value
 * @param {Function} props.onValueChange - Function called when value changes
 * @param {React.ReactNode} props.children - Select content
 * @returns {JSX.Element} Component JSX
 */
export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
};

Select.propTypes = {
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  children: PropTypes.node
};

/**
 * Select trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SelectTrigger = forwardRef(({ children, className = '', ...props }, ref) => {
  const { setOpen } = useContext(SelectContext);

  return (
    <button
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(prev => !prev)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

SelectTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Select value component
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.children - Value content
 * @returns {JSX.Element} Component JSX
 */
export const SelectValue = ({ placeholder, children }) => {
  const { value } = useContext(SelectContext);
  
  // Find the display text for the selected value
  const getDisplayText = () => {
    // If there's no value, return the placeholder
    if (!value) return placeholder;
    
    // If children is a string, return it
    if (typeof children === 'string') return children;
    
    // If we have React elements as children (SelectItem components)
    if (React.Children.count(children) > 0) {
      // Try to find the selected item from the parent's SelectContent > SelectItem structure
      const parentNode = document.getElementById(`select-${value}`);
      if (parentNode) {
        return parentNode.textContent;
      }
    }
    
    // Fallback: Convert value to display format (e.g., real_estate -> Real Estate)
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <span className="text-sm">
      {getDisplayText()}
    </span>
  );
};

SelectValue.propTypes = {
  placeholder: PropTypes.string,
  children: PropTypes.node
};

/**
 * Select content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const SelectContent = ({ children, className = '', ...props }) => {
  const { open, setOpen } = useContext(SelectContext);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50" 
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
        {...props}
      >
        <div className="w-full p-1">
          {children}
        </div>
      </div>
    </>
  );
};

SelectContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Select item component
 * @param {Object} props - Component props
 * @param {string} props.value - Item value
 * @param {React.ReactNode} props.children - Item content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SelectItem = forwardRef(({ value, children, className = '', ...props }, ref) => {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      id={`select-${value}`}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-accent text-accent-foreground' : ''} ${className}`}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </span>
      )}
      <span className="text-sm">{children}</span>
    </div>
  );
});

SelectItem.displayName = 'SelectItem';

SelectItem.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string
}; 