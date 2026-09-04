import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-primary`} />
      {message && <p className="mt-2.5 text-xs font-medium text-text-muted">{message}</p>}
    </div>
  );
};

export default Loading;
