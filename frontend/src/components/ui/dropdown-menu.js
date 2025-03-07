import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Check, ChevronRight } from 'lucide-react';

// Create context for dropdown menu state
const DropdownMenuContext = createContext(null);

/**
 * Dropdown menu root component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Dropdown menu content
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.node
};

/**
 * Dropdown menu trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.asChild - Whether to render as a child
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuTrigger = ({ children, asChild, ...props }) => {
  const { setOpen } = useContext(DropdownMenuContext);

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

DropdownMenuTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
  onClick: PropTypes.func
};

/**
 * Dropdown menu content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.align - Alignment (center, start, end)
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const DropdownMenuContent = ({ 
  children, 
  className = '', 
  align = 'center',
  ...props 
}) => {
  const { open } = useContext(DropdownMenuContext);
  
  if (!open) return null;

  const alignClasses = {
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0',
    end: 'right-0'
  };

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 top-full mt-2 ${alignClasses[align]} ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

DropdownMenuContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.oneOf(['center', 'start', 'end'])
};

/**
 * Dropdown menu item component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Item content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the item is disabled
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '', 
  ...props 
}) => {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (disabled) return;
    
    if (onClick) {
      onClick(e);
    }
    
    setOpen(false);
  };

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

DropdownMenuItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Dropdown menu checkbox item component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Item content
 * @param {boolean} props.checked - Whether the item is checked
 * @param {Function} props.onCheckedChange - Function called when checked state changes
 * @param {boolean} props.disabled - Whether the item is disabled
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuCheckboxItem = ({ 
  children, 
  checked = false,
  onCheckedChange,
  disabled = false,
  className = '', 
  ...props 
}) => {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (disabled) return;
    
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
    
    setOpen(false);
  };

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
};

DropdownMenuCheckboxItem.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Dropdown menu radio item component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Item content
 * @param {string} props.value - Item value
 * @param {boolean} props.disabled - Whether the item is disabled
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuRadioItem = ({ 
  children, 
  value,
  disabled = false,
  className = '', 
  ...props 
}) => {
  const { setOpen } = useContext(DropdownMenuContext);
  const radioContext = useContext(DropdownMenuRadioGroupContext);

  const handleClick = (e) => {
    if (disabled) return;
    
    if (radioContext && radioContext.onValueChange) {
      radioContext.onValueChange(value);
    }
    
    setOpen(false);
  };

  const isChecked = radioContext ? radioContext.value === value : false;

  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isChecked && (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      {children}
    </div>
  );
};

DropdownMenuRadioItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

// Create context for radio group state
const DropdownMenuRadioGroupContext = createContext(null);

/**
 * Dropdown menu radio group component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Radio group content
 * @param {string} props.value - Selected value
 * @param {Function} props.onValueChange - Function called when value changes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </DropdownMenuRadioGroupContext.Provider>
  );
};

DropdownMenuRadioGroup.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onValueChange: PropTypes.func
};

/**
 * Dropdown menu label component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Label content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuLabel = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-2 py-1.5 text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

DropdownMenuLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dropdown menu separator component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuSeparator = ({ className = '', ...props }) => {
  return (
    <div
      className={`-mx-1 my-1 h-px bg-muted ${className}`}
      {...props}
    />
  );
};

DropdownMenuSeparator.propTypes = {
  className: PropTypes.string
};

/**
 * Dropdown menu sub component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Sub menu content
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuSub = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenuSub.propTypes = {
  children: PropTypes.node
};

/**
 * Dropdown menu sub trigger component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DropdownMenuSubTrigger = ({ children, className = '', ...props }) => {
  const { setOpen } = useContext(DropdownMenuContext);

  return (
    <div
      className={`flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  );
};

DropdownMenuSubTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dropdown menu sub content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const DropdownMenuSubContent = ({ children, className = '', ...props }) => {
  const { open } = useContext(DropdownMenuContext);
  
  if (!open) return null;

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 left-full top-0 ml-1 ${className}`}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      {...props}
    >
      {children}
    </div>
  );
};

DropdownMenuSubContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}; 