import React from 'react';
import { RotateCcw } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Offered (Pending)', value: 'Offered' },
  { label: 'Declined', value: 'Declined' },
  { label: 'Expired', value: 'Expired' }
];

const departmentOptions = [
  { label: 'All Departments', value: 'All' },
  { label: 'CSE', value: 'CSE' },
  { label: 'IT', value: 'IT' },
  { label: 'ECE', value: 'ECE' },
  { label: 'EEE', value: 'EEE' },
  { label: 'MECH', value: 'MECH' }
];

const OfferFilters = ({
  search = '',
  status = 'All',
  department = 'All',
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onReset
}) => {
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || department !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by student, company, job title, or offer ID..."
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

export default OfferFilters;
