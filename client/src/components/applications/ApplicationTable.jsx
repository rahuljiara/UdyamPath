import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const ApplicationTable = ({
  applications = [],
  loading = false,
  onUpdateStatus,
  onDelete,
  onResetFilters
}) => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching student applications..." />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No applications found"
          description="Try adjusting your filter options or search query to find candidate applications."
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
              <th className="px-4 py-3.5">Candidate / Student</th>
              <th className="px-4 py-3.5">Company & Role</th>
              <th className="px-4 py-3.5">Applied Date</th>
              <th className="px-4 py-3.5">Current Stage</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Student Avatar + Name + Dept + CGPA */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={app.studentAvatar}
                      name={app.studentName}
                      size="md"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(app.studentId)}
                        className="font-bold text-text-primary hover:text-primary transition-colors block text-sm truncate"
                      >
                        {app.studentName}
                      </Link>
                      <span className="text-[11px] text-text-muted">
                        {app.studentDepartment} • CGPA {app.studentCgpa || '—'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Company & Role */}
                <td className="px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate max-w-[200px]">
                      {app.companyName}
                    </p>
                    <Link
                      to={app.driveId ? ROUTES.DRIVES.DETAILS(app.driveId) : ROUTES.DRIVES.ROOT}
                      className="text-[11px] text-text-muted hover:text-primary transition-colors block truncate max-w-[200px]"
                    >
                      {app.position}
                    </Link>
                  </div>
                </td>

                {/* Applied Date */}
                <td className="px-4 py-3.5 text-text-muted">
                  {formatDate(app.appliedAt)}
                </td>

                {/* Current Stage */}
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/70">
                    {app.currentStage}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={app.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.APPLICATIONS.DETAILS(app.id))}
                      className="text-xs py-1 px-2.5 flex items-center gap-1 text-primary border-primary/30 hover:bg-primary-soft/50"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Button>

                    {!isStudent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateStatus?.(app)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Update Stage & Status"
                          aria-label="Update Stage & Status"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(app)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Application"
                          aria-label="Delete Application"
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

export default ApplicationTable;
