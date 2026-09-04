import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  headerBorder = true,
  padding = true,
  className = '',
  bodyClassName = ''
}) => {
  const hasHeader = title || subtitle || action;

  return (
    <div className={`bg-surface rounded-xl border border-border-color shadow-subtle ${className}`}>
      {hasHeader && (
        <div
          className={`flex items-center justify-between px-5 py-4 ${
            headerBorder ? 'border-b border-border-color' : ''
          }`}
        >
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`${padding ? 'p-5' : ''} ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
