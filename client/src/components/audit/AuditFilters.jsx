import React from 'react';
import { RotateCcw } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const categoryOptions = [
  { label: 'All Categories', value: 'All' },
  { label: 'Placement & Offers', value: 'Placement' },
  { label: 'Placement Drives', value: 'Drive' },
  { label: 'Applications', value: 'Application' },
  { label: 'Interviews', value: 'Interview' },
  { label: 'Student Records', value: 'Student' },
  { label: 'System & Policy', value: 'System' },
  { label: 'Security & Auth', value: 'Security' }
];

const severityOptions = [
  { label: 'All Severities', value: 'All' },
  { label: 'Success', value: 'Success' },
  { label: 'Info', value: 'Info' },
  { label: 'Warning', value: 'Warning' }
];

const AuditFilters = ({
  search = '',
  category = 'All',
  severity = 'All',
  onSearchChange,
  onCategoryChange,
  onSeverityChange,
  onReset
}) => {
  const hasActiveFilters = search.trim() !== '' || category !== 'All' || severity !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by action, user actor, target entity, or IP address..."
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Severity */}
        <select
          value={severity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {severityOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-text-primary py-2 px-2.5"
            title="Reset Filters"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuditFilters;
