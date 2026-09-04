import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { ROUTES } from '../../routes/paths';
import { formatDate } from '../../utils/formatters';

const RecentApplicationsTable = ({ applications = [] }) => {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent Applications"
      subtitle="Latest student submissions across active campus drives"
      action={
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
          className="text-xs text-primary hover:text-primary-hover hover:bg-primary-soft/50"
        >
          View All
        </Button>
      }
      padding={false}
      className="h-full"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Company & Role</th>
              <th className="px-4 py-3">Current Stage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/70 text-text-primary">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Student */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={app.studentAvatar} name={app.studentName} size="sm" />
                    <div>
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(app.studentId)}
                        className="font-semibold text-text-primary hover:text-primary block leading-tight"
                      >
                        {app.studentName}
                      </Link>
                      <span className="text-[11px] text-text-muted">
                        {app.studentDepartment} • CGPA {app.studentCgpa}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Company & Role */}
                <td className="px-4 py-3">
                  <p className="font-medium text-text-primary">{app.companyName}</p>
                  <p className="text-[11px] text-text-muted truncate max-w-[160px]">{app.position}</p>
                </td>

                {/* Stage */}
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                    {app.currentStage}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} size="sm" />
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.APPLICATIONS.DETAILS(app.id))}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                    aria-label="View application"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentApplicationsTable;
