import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Dialog component for modal dialogs
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onOpenChange - Function to call when open state changes
 * @param {React.ReactNode} props.children - Dialog content
 * @returns {JSX.Element|null} Component JSX or null if not open
 */
export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node
};

/**
 * Dialog content component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DialogContent = ({ children, className = '', ...props }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && contentRef.current) {
        const dialog = contentRef.current.closest('[role="dialog"]');
        if (dialog) {
          const onOpenChange = dialog.getAttribute('data-on-open-change');
          if (onOpenChange && typeof window[onOpenChange] === 'function') {
            window[onOpenChange](false);
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div 
      ref={contentRef}
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[85vh] overflow-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

DialogContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dialog header component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DialogHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-6 pb-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

DialogHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dialog title component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
};

DialogTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dialog description component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Description content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DialogDescription = ({ children, className = '', ...props }) => {
  return (
    <p 
      className={`mt-2 text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

DialogDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Dialog footer component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const DialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`p-6 pt-3 flex justify-end space-x-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

DialogFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}; 