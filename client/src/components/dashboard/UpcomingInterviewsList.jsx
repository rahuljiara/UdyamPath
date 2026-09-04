import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Video, MapPin } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { ROUTES } from '../../routes/paths';
import { formatDate } from '../../utils/formatters';

const UpcomingInterviewsList = ({ interviews = [] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Upcoming Interviews"
      subtitle="Scheduled assessment rounds for today & this week"
      action={
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate(ROUTES.INTERVIEWS.ROOT)}
          className="text-xs text-primary hover:text-primary-hover hover:bg-primary-soft/50"
        >
          View Calendar
        </Button>
      }
      padding={false}
      className="h-full"
    >
      <div className="divide-y divide-border-color/70">
        {interviews.map((item) => (
          <div key={item.id} className="p-4 hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar src={item.studentAvatar} name={item.studentName} size="md" className="shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text-primary text-xs">{item.studentName}</span>
                  <span className="text-[10px] bg-primary-soft text-primary font-medium px-1.5 py-0.2 rounded border border-primary-200/50">
                    {item.round}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  {item.companyName} • <span className="text-text-secondary">{item.position}</span>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-text-muted pt-0.5">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(item.date)}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.startTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
                {item.mode.toLowerCase().includes('online') ? (
                  <Video className="w-3 h-3 text-sky-600" />
                ) : (
                  <MapPin className="w-3 h-3 text-amber-600" />
                )}
                {item.mode}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingInterviewsList;
