import React, { useState } from 'react';
import { getInitials } from '../../utils/formatters';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base font-medium',
  xl: 'w-16 h-16 text-xl font-medium'
};

const Avatar = ({ src, alt = '', name = '', size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;
  const initials = getInitials(name || alt);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-[#E8F5F1] text-primary-dark font-medium border border-border-color/60 overflow-hidden ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
