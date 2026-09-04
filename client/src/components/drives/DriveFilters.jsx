import React from 'react';
import { RotateCcw } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Closed', value: 'Closed' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Draft', value: 'Draft' }
];

const jobTypeOptions = [
  { label: 'All Job Types', value: 'All' },
  { label: 'Full-Time', value: 'Full-Time' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Intern + FTE', value: 'Intern + FTE' }
];

const DriveFilters = ({
  search = '',
  status = 'All',
  jobType = 'All',
  company = 'All',
  companies = [],
  onSearchChange,
  onStatusChange,
  onJobTypeChange,
  onCompanyChange,
  onReset
}) => {
  const hasActiveFilters =
    search.trim() !== '' || status !== 'All' || jobType !== 'All' || company !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by job title, company, location, or drive ID..."
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Company */}
        <select
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors max-w-[180px]"
        >
          <option value="All">All Companies</option>
          {companies.map((c) => (
            <option key={c.id || c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Job Type */}
        <select
          value={jobType}
          onChange={(e) => onJobTypeChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {jobTypeOptions.map((j) => (
            <option key={j.value} value={j.value}>
              {j.label}
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

export default DriveFilters;
