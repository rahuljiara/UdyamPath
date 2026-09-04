import React from 'react';

const InfoItem = ({
  label,
  value,
  icon: Icon,
  href,
  className = ''
}) => {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors truncate block"
          >
            {value || '—'}
          </a>
        ) : (
          <p className="text-sm font-medium text-text-primary truncate">{value || '—'}</p>
        )}
      </div>
    </div>
  );
};

export default InfoItem;
