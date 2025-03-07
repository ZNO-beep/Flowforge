import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar root component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Avatar content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Avatar = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * Avatar image component
 * @param {Object} props - Component props
 * @param {string} props.src - Image source
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const AvatarImage = forwardRef(({ src, alt = '', className = '', ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
      {...props}
    />
  );
});

AvatarImage.displayName = 'AvatarImage';

AvatarImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string
};

/**
 * Avatar fallback component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Fallback content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const AvatarFallback = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

AvatarFallback.displayName = 'AvatarFallback';

AvatarFallback.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}; 