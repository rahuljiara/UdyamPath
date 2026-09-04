import React from 'react';
import { RotateCcw } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Applied', value: 'Applied' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Selected', value: 'Selected' },
  { label: 'Rejected', value: 'Rejected' }
];

const stageOptions = [
  { label: 'All Stages', value: 'All' },
  { label: 'Application', value: 'Application' },
  { label: 'Aptitude Test', value: 'Aptitude Test' },
  { label: 'Technical Test', value: 'Technical Test' },
  { label: 'Technical Interview', value: 'Technical Interview' },
  { label: 'HR Interview', value: 'HR Interview' },
  { label: 'Final Selection', value: 'Final Selection' }
];

const departmentOptions = [
  { label: 'All Departments', value: 'All' },
  { label: 'CSE', value: 'CSE' },
  { label: 'IT', value: 'IT' },
  { label: 'ECE', value: 'ECE' },
  { label: 'EEE', value: 'EEE' },
  { label: 'MECH', value: 'MECH' }
];

const ApplicationFilters = ({
  search = '',
  status = 'All',
  stage = 'All',
  department = 'All',
  onSearchChange,
  onStatusChange,
  onStageChange,
  onDepartmentChange,
  onReset
}) => {
  const hasActiveFilters =
    search.trim() !== '' || status !== 'All' || stage !== 'All' || department !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by student name, roll ID, company, or position..."
        />
      </div>

      {/* Dropdown Filters */}
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

        {/* Stage */}
        <select
          value={stage}
          onChange={(e) => onStageChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {stageOptions.map((stg) => (
            <option key={stg.value} value={stg.value}>
              {stg.label}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {departmentOptions.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
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

export default ApplicationFilters;
