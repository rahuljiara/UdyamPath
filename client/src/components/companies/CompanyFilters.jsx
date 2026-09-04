import React from 'react';
import { RotateCcw, LayoutGrid, List } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const industries = [
  { label: 'All Industries', value: 'All' },
  { label: 'Technology & Cloud', value: 'Technology & Cloud' },
  { label: 'IT Services & Consulting', value: 'IT Services & Consulting' },
  { label: 'Consumer Internet & Tech', value: 'Consumer Internet & Tech' },
  { label: 'Management Consulting', value: 'Management & Technology Consulting' },
  { label: 'Networking & Security', value: 'Networking & Cybersecurity' },
  { label: 'FinTech & Banking', value: 'Investment Banking & FinTech' }
];

const companyTypes = [
  { label: 'All Types', value: 'All' },
  { label: 'MNC / Product', value: 'MNC / Product' },
  { label: 'Product / Tech Unicorn', value: 'Product / Tech Unicorn' },
  { label: 'MNC / IT Services', value: 'MNC / IT Services' },
  { label: 'MNC / Consulting', value: 'MNC / Consulting' }
];

const statuses = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];

const CompanyFilters = ({
  search = '',
  industry = 'All',
  type = 'All',
  status = 'All',
  viewMode = 'table', // 'table' | 'grid'
  onSearchChange,
  onIndustryChange,
  onTypeChange,
  onStatusChange,
  onViewModeChange,
  onReset
}) => {
  const hasActiveFilters =
    search.trim() !== '' || industry !== 'All' || type !== 'All' || status !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by company name, industry, city, or ID..."
        />
      </div>

      {/* Dropdown Filters & View Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Industry */}
        <select
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>

        {/* Company Type */}
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {companyTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-text-primary'
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-text-primary'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>

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

export default CompanyFilters;
