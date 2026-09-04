import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, ExternalLink, Edit2, Trash2, MessageSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const InterviewTimelineView = ({
  interviews = [],
  loading = false,
  onEdit,
  onDelete
}) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color p-8 text-center">
        <EmptyState
          title="No interview appointments"
          description="There are no scheduled interviews for the selected filters."
        />
      </div>
    );
  }

  // Group interviews by Date
  const grouped = interviews.reduce((acc, curr) => {
    const key = curr.date || 'Undated';
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="space-y-3">
          {/* Date Separator Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-soft text-primary font-bold text-xs rounded-lg border border-primary-200/60">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(dateKey)}</span>
            </div>
            <span className="text-xs text-text-muted font-medium">
              ({grouped[dateKey].length} session{grouped[dateKey].length > 1 ? 's' : ''})
            </span>
            <div className="h-px bg-border-color flex-1 ml-2" />
          </div>

          {/* Cards for this Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[dateKey].map((int) => (
              <div
                key={int.id}
                className="bg-white rounded-xl border border-border-color p-4 shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Round & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      {int.round}
                    </span>
                    <StatusBadge status={int.status} size="sm" />
                  </div>

                  {/* Candidate Info */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <Avatar src={int.studentAvatar} name={int.studentName} size="sm" />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(int.studentId)}
                        className="font-bold text-text-primary hover:text-primary transition-colors text-xs truncate block"
                      >
                        {int.studentName}
                      </Link>
                      <span className="text-[11px] text-text-muted block">
                        {int.studentDepartment}
                      </span>
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="text-xs">
                    <p className="font-semibold text-text-primary">{int.companyName}</p>
                    <p className="text-[11px] text-text-muted truncate">{int.position}</p>
                  </div>

                  {/* Timing & Venue */}
                  <div className="space-y-1 text-xs text-text-muted pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {int.startTime} - {int.endTime}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {int.mode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-text-muted truncate max-w-[150px]">
                        Panel: <strong className="text-text-secondary">{int.interviewer}</strong>
                      </span>
                      {int.meetingLink && (
                        <a
                          href={int.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          Join <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Feedback Snippet if any */}
                  {int.feedback && (
                    <div className="p-2 rounded bg-slate-50 text-[11px] text-text-muted border border-slate-200/50 flex items-start gap-1.5">
                      <MessageSquare className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{int.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer (Admin / Manager only) */}
                {(onEdit || onDelete) && (
                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(int)}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg text-xs"
                        title="Edit Slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(int)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                        title="Cancel Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewTimelineView;
