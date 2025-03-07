import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create context for popover state
const PopoverContext = createContext(null);

/**
 * Popover root component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Popover content
 * @returns {JSX.Element} Component JSX
 */
export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={popoverRef} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

Popover.propTypes = {
  children: PropTypes.node
};

/**
 * Popover trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.asChild - Whether to render as a child
 * @returns {JSX.Element} Component JSX
 */
export const PopoverTrigger = ({ children, asChild, ...props }) => {
  const { setOpen } = useContext(PopoverContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(prev => !prev);
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  if (asChild) {
    return React.cloneElement(children, { 
      ...props,
      onClick: handleClick
    });
  }

  return (
    <button 
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

PopoverTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
  onClick: PropTypes.func
};

/**
 * Popover content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.align - Alignment (center, start, end)
 * @param {string} props.side - Side to show popover (top, right, bottom, left)
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const PopoverContent = ({ 
  children, 
  className = '', 
  align = 'center',
  side = 'bottom',
  ...props 
}) => {
  const { open } = useContext(PopoverContext);
  
  if (!open) return null;

  const alignClasses = {
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0',
    end: 'right-0'
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${sideClasses[side]} ${alignClasses[align]} ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

PopoverContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.oneOf(['center', 'start', 'end']),
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
}; 