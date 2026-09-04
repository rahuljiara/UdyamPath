import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Clock, Users, IndianRupee } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { ROUTES } from '../../routes/paths';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const ActiveDrivesList = ({ drives = [] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Active Placement Drives"
      subtitle="Recruitment drives currently accepting applications or in selection"
      action={
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate(ROUTES.DRIVES.ROOT)}
          className="text-xs text-primary hover:text-primary-hover hover:bg-primary-soft/50"
        >
          View All Drives
        </Button>
      }
      padding={false}
    >
      <div className="divide-y divide-border-color/70">
        {drives.map((drive) => (
          <div
            key={drive.id}
            className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Company & Role */}
            <div className="flex items-start gap-3.5 min-w-0">
              <Avatar
                src={drive.companyLogo}
                name={drive.companyName}
                size="md"
                className="rounded-lg shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-text-primary hover:text-primary transition-colors truncate">
                    <Link to={ROUTES.DRIVES.DETAILS(drive.id)}>{drive.title}</Link>
                  </h4>
                  <StatusBadge status={drive.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-1 flex-wrap">
                  <span className="font-medium text-text-secondary">{drive.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <IndianRupee className="w-3 h-3 text-slate-400" />
                    {drive.ctc}
                  </span>
                  <span>•</span>
                  <span>{drive.location}</span>
                </div>
              </div>
            </div>

            {/* Right: Metrics & Quick Action */}
            <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 shrink-0 text-xs">
              <div className="space-y-0.5 text-left md:text-right">
                <span className="text-[11px] text-text-muted block">Applications</span>
                <span className="font-bold text-text-primary">{drive.applicationsCount}</span>
                <span className="text-text-muted text-[10px]"> / {drive.openings} Openings</span>
              </div>

              <div className="space-y-0.5 text-left md:text-right">
                <span className="text-[11px] text-text-muted block">Deadline</span>
                <span className="font-medium text-text-primary block">{formatDate(drive.applicationDeadline)}</span>
                <span className="text-amber-600 text-[10px] font-semibold bg-amber-50 px-1.5 py-0.2 rounded inline-block">
                  {formatRelativeTime(drive.applicationDeadline)}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.DRIVES.DETAILS(drive.id))}
                className="text-xs py-1.5"
              >
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActiveDrivesList;
