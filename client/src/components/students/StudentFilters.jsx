import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const departments = [
  { label: 'All Departments', value: 'All' },
  { label: 'Computer Science (CSE)', value: 'CSE' },
  { label: 'Information Technology (IT)', value: 'IT' },
  { label: 'Electronics & Comm (ECE)', value: 'ECE' },
  { label: 'Electrical & Electronics (EEE)', value: 'EEE' },
  { label: 'Mechanical Engg (MECH)', value: 'MECH' }
];

const batches = [
  { label: 'All Batches', value: 'All' },
  { label: '2021-2025 (Current)', value: '2021-2025' },
  { label: '2020-2024 (Past)', value: '2020-2024' },
  { label: '2022-2026 (Upcoming)', value: '2022-2026' }
];

const statuses = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Placed', value: 'Placed' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Applied', value: 'Applied' },
  { label: 'Unplaced', value: 'Unplaced' },
  { label: 'Ineligible', value: 'Ineligible' }
];

const StudentFilters = ({
  search = '',
  department = 'All',
  batch = 'All',
  status = 'All',
  onSearchChange,
  onDepartmentChange,
  onBatchChange,
  onStatusChange,
  onReset
}) => {
  const hasActiveFilters =
    search.trim() !== '' || department !== 'All' || batch !== 'All' || status !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by student name, roll number, email, or skill..."
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Department */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {departments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Batch */}
        <select
          value={batch}
          onChange={(e) => onBatchChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {batches.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
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

        {/* Reset Filters */}
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

export default StudentFilters;
