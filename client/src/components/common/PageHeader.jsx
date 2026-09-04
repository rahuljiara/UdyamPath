import React from 'react';
import Breadcrumb from './Breadcrumb';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}) => {
  return (
    <div className={`space-y-2 mb-6 ${className}`}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-2" />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
