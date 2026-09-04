import React from 'react';
import { RotateCcw, Calendar as CalendarIcon, List } from 'lucide-react';
import Search from '../common/Search';
import Button from '../common/Button';

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Rescheduled', value: 'Rescheduled' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const modeOptions = [
  { label: 'All Modes', value: 'All' },
  { label: 'Online (Teams / Meet)', value: 'Online' },
  { label: 'Campus / Offline', value: 'Campus' }
];

const InterviewFilters = ({
  search = '',
  status = 'All',
  mode = 'All',
  viewMode = 'table', // 'table' | 'calendar'
  onSearchChange,
  onStatusChange,
  onModeChange,
  onViewModeChange,
  onReset
}) => {
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || mode !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-border-color shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <Search
          value={search}
          onChange={onSearchChange}
          placeholder="Search by student, company, interviewer, or round..."
        />
      </div>

      {/* Filter Dropdowns & View Switcher */}
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

        {/* Mode */}
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          className="bg-white border border-border-color rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors"
        >
          {modeOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
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
            title="List Table View"
            aria-label="List Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('calendar')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'calendar' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-text-primary'
            }`}
            title="Calendar Timeline View"
            aria-label="Calendar Timeline View"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
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

export default InterviewFilters;
