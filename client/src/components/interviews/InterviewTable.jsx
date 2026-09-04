import React from 'react';
import { Link } from 'react-router-dom';
import { Video, MapPin, Calendar, Clock, Edit2, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const InterviewTable = ({
  interviews = [],
  loading = false,
  onEdit,
  onDelete,
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching interview schedule..." />
      </div>
    );
  }

  if (!interviews || interviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No interviews found"
          description="No evaluation interviews match your selected filters."
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
              <th className="px-4 py-3.5">Round</th>
              <th className="px-4 py-3.5">Student / Candidate</th>
              <th className="px-4 py-3.5">Company & Role</th>
              <th className="px-4 py-3.5">Date & Time</th>
              <th className="px-4 py-3.5">Mode & Venue</th>
              <th className="px-4 py-3.5">Interviewer</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {interviews.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Round */}
                <td className="px-4 py-3.5">
                  <span className="font-bold text-text-primary text-xs block">
                    {item.round}
                  </span>
                </td>

                {/* Student */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={item.studentAvatar}
                      name={item.studentName}
                      size="sm"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(item.studentId)}
                        className="font-semibold text-text-primary hover:text-primary transition-colors block truncate"
                      >
                        {item.studentName}
                      </Link>
                      <span className="text-[11px] text-text-muted">{item.studentDepartment}</span>
                    </div>
                  </div>
                </td>

                {/* Company & Role */}
                <td className="px-4 py-3.5">
                  <p className="font-medium text-text-primary truncate max-w-[170px]">
                    {item.companyName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate max-w-[170px]">{item.position}</p>
                </td>

                {/* Date & Time */}
                <td className="px-4 py-3.5">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-text-primary flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(item.date)}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                </td>

                {/* Mode & Venue */}
                <td className="px-4 py-3.5">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                      {item.mode.toLowerCase().includes('online') ? (
                        <Video className="w-3 h-3 text-sky-600" />
                      ) : (
                        <MapPin className="w-3 h-3 text-amber-600" />
                      )}
                      {item.mode}
                    </span>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium truncate max-w-[140px]"
                      >
                        Join Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </td>

                {/* Interviewer */}
                <td className="px-4 py-3.5 text-text-secondary">
                  <span className="font-medium text-text-primary block">{item.interviewer}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={item.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                        title="Edit / Reschedule Slot"
                        aria-label="Edit / Reschedule Slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Cancel / Delete Slot"
                        aria-label="Cancel / Delete Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    {!onEdit && !onDelete && (
                      <span className="text-[11px] text-text-muted italic">Scheduled</span>
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

export default InterviewTable;
