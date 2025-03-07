import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

// Create context for sheet state
const SheetContext = createContext(null);

/**
 * Sheet root component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the sheet is open
 * @param {Function} props.onOpenChange - Function called when open state changes
 * @param {React.ReactNode} props.children - Sheet content
 * @returns {JSX.Element} Component JSX
 */
export const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

Sheet.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node
};

/**
 * Sheet trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.asChild - Whether to render as a child
 * @returns {JSX.Element} Component JSX
 */
export const SheetTrigger = ({ children, asChild, ...props }) => {
  const { onOpenChange } = useContext(SheetContext);

  const handleClick = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
    onOpenChange(true);
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

SheetTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
  onClick: PropTypes.func
};

/**
 * Sheet close component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Close button content
 * @returns {JSX.Element} Component JSX
 */
export const SheetClose = ({ children, ...props }) => {
  const { onOpenChange } = useContext(SheetContext);

  const handleClick = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
    onOpenChange(false);
  };

  return (
    <button 
      type="button"
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      onClick={handleClick}
      {...props}
    >
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  );
};

SheetClose.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

/**
 * Sheet content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.side - Side to show sheet (top, right, bottom, left)
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const SheetContent = ({ 
  children, 
  className = '', 
  side = 'right',
  ...props 
}) => {
  const { open, onOpenChange } = useContext(SheetContext);
  
  if (!open) return null;

  const sideClasses = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 border-l',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 border-r'
  };

  const sizeClasses = {
    top: 'h-1/3',
    right: 'w-3/4 max-w-sm',
    bottom: 'h-1/3',
    left: 'w-3/4 max-w-sm'
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/80"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out ${sideClasses[side]} ${sizeClasses[side]} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <SheetClose />
        {children}
      </div>
    </>
  );
};

SheetContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
};

/**
 * Sheet header component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SheetHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

SheetHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Sheet title component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SheetTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 
      className={`text-lg font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

SheetTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Sheet description component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Description content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SheetDescription = ({ children, className = '', ...props }) => {
  return (
    <p 
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

SheetDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Sheet footer component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const SheetFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

SheetFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}; 