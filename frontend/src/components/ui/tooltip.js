import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create context for tooltip state
const TooltipContext = createContext(null);

/**
 * Tooltip provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tooltip content
 * @param {boolean} props.delayDuration - Delay before showing tooltip (ms)
 * @returns {JSX.Element} Component JSX
 */
export const TooltipProvider = ({ children, delayDuration = 300 }) => {
  return (
    <TooltipContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipContext.Provider>
  );
};

TooltipProvider.propTypes = {
  children: PropTypes.node,
  delayDuration: PropTypes.number
};

/**
 * Tooltip root component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tooltip content
 * @returns {JSX.Element} Component JSX
 */
export const Tooltip = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { delayDuration } = useContext(TooltipContext) || { delayDuration: 300 };
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
        {children}
      </TooltipContext.Provider>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node
};

/**
 * Tooltip trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.asChild - Whether to render as a child
 * @returns {JSX.Element} Component JSX
 */
export const TooltipTrigger = ({ children, asChild, ...props }) => {
  if (asChild) {
    return React.cloneElement(children, { ...props });
  }

  return (
    <span {...props}>
      {children}
    </span>
  );
};

TooltipTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool
};

/**
 * Tooltip content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.side - Side to show tooltip (top, right, bottom, left)
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const TooltipContent = ({ children, className = '', side = 'top', ...props }) => {
  const { open } = useContext(TooltipContext);
  
  if (!open) return null;

  const sideClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-2 border-l-2 border-transparent border-current rotate-45',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-t-2 border-r-2 border-transparent border-current -rotate-45',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-2 border-r-2 border-transparent border-current -rotate-45',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-b-2 border-l-2 border-transparent border-current rotate-45'
  };

  return (
    <div
      className={`absolute z-50 max-w-xs px-3 py-1.5 text-xs font-medium text-white bg-black rounded-md shadow-sm animate-in fade-in-50 ${sideClasses[side]} ${className}`}
      {...props}
    >
      {children}
      <div className={`absolute w-2 h-2 bg-black ${arrowClasses[side]}`} />
    </div>
  );
};

TooltipContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
}; 