import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, Calendar, Clock, IndianRupee, Users, ArrowRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const DriveTable = ({
  drives = [],
  loading = false,
  onDelete,
  onResetFilters
}) => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching campus placement drives..." />
      </div>
    );
  }

  if (!drives || drives.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No placement drives found"
          description="Try adjusting your search criteria or filter options to locate recruitment campaigns."
          actionLabel="Clear Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
              <th className="px-4 py-3.5">Drive / Job Role</th>
              <th className="px-4 py-3.5">Company</th>
              <th className="px-4 py-3.5">CTC / Package</th>
              <th className="px-4 py-3.5">Application Deadline</th>
              <th className="px-4 py-3.5">Openings</th>
              <th className="px-4 py-3.5">Applications</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {drives.map((drive) => (
              <tr
                key={drive.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Drive Title & ID */}
                <td className="px-4 py-3.5">
                  <div className="min-w-0">
                    <Link
                      to={ROUTES.DRIVES.DETAILS(drive.id)}
                      className="font-bold text-text-primary hover:text-primary transition-colors block text-sm truncate"
                    >
                      {drive.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                      <span className="font-mono">{drive.driveId}</span>
                      <span>•</span>
                      <span>{drive.jobType}</span>
                    </div>
                  </div>
                </td>
                {/* Company Logo + Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={drive.companyLogo}
                      name={drive.companyName}
                      size="sm"
                      className="rounded-lg shrink-0"
                    />
                    <Link
                      to={drive.companyId ? ROUTES.COMPANIES.DETAILS(drive.companyId) : ROUTES.COMPANIES.ROOT}
                      className="font-semibold text-text-primary hover:text-primary transition-colors truncate max-w-[130px]"
                    >
                      {drive.companyName}
                    </Link>
                  </div>
                </td>

                {/* CTC Package */}
                <td className="px-4 py-3.5">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-slate-400" />
                    {drive.ctc}
                  </span>
                  <span className="text-[10px] text-text-muted block truncate max-w-[140px]">{drive.location}</span>
                </td>

                {/* Deadline with Countdown badge */}
                <td className="px-4 py-3.5">
                  <div>
                    <span className="text-text-primary font-medium block">
                      {formatDate(drive.applicationDeadline)}
                    </span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5">
                      {formatRelativeTime(drive.applicationDeadline)}
                    </span>
                  </div>
                </td>

                {/* Openings */}
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-text-primary">{drive.openings} positions</span>
                </td>

                {/* Applications Count */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-text-primary">{drive.applicationsCount}</span>
                    <span className="text-text-muted text-[11px]">applied</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={drive.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(ROUTES.DRIVES.DETAILS(drive.id))}
                      className="text-xs py-1 px-2.5 text-primary border-primary/30 hover:bg-primary-soft/50"
                      title="View Details"
                    >
                      View
                    </Button>

                    {!isStudent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.DRIVES.EDIT(drive.id))}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Edit Drive"
                          aria-label="Edit Drive"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(drive)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Drive"
                          aria-label="Delete Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriveTable;
