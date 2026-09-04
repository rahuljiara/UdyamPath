import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'py-1.5 pl-8 pr-7 text-xs',
    md: 'py-2 pl-9 pr-8 text-sm'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3'
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon className={`absolute text-slate-400 pointer-events-none ${iconSizes[size] || iconSizes.md}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border border-border-color rounded-lg text-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.('');
            onClear?.();
          }}
          className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Search;
