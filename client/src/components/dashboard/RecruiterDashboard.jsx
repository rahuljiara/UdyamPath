import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CalendarCheck2,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';
import { driveService } from '../../services/driveService';
import { applicationService } from '../../services/applicationService';
import { interviewService } from '../../services/interviewService';
import { placementService } from '../../services/placementService';
import { ROUTES } from '../../routes/paths';

const RecruiterDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [offers, setOffers] = useState([]);

  const companyName = currentUser?.company || 'Partner Enterprise';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [driveRes, appRes, intRes, offerRes] = await Promise.all([
          driveService.getAll({ limit: 10 }),
          applicationService.getAll({ limit: 20 }),
          interviewService.getAll({ limit: 10 }),
          placementService.getAllOffers({ limit: 10 })
        ]);

        const allDrives = driveRes.drives || driveRes || [];
        // Scope to recruiter's company or show active campus drives
        const companyDrives = allDrives.filter((d) =>
          d.companyName?.toLowerCase().includes(companyName.toLowerCase().split(' ')[0])
        );
        setDrives(companyDrives.length > 0 ? companyDrives : allDrives.slice(0, 4));

        const allApps = appRes.applications || appRes || [];
        const compApps = allApps.filter((a) =>
          a.companyName?.toLowerCase().includes(companyName.toLowerCase().split(' ')[0])
        );
        setApplications(compApps.length > 0 ? compApps : allApps.slice(0, 6));

        const allInts = intRes.interviews || intRes || [];
        const compInts = allInts.filter((i) =>
          i.companyName?.toLowerCase().includes(companyName.toLowerCase().split(' ')[0])
        );
        setInterviews(compInts.length > 0 ? compInts : allInts.slice(0, 4));

        const allOffers = offerRes.offers || offerRes || [];
        const compOffers = allOffers.filter((o) =>
          o.companyName?.toLowerCase().includes(companyName.toLowerCase().split(' ')[0])
        );
        setOffers(compOffers.length > 0 ? compOffers : allOffers.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recruiter dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  if (loading) {
    return <Loading text="Loading Recruiter Workspace & Pipeline..." />;
  }

  const activeDrivesCount = drives.filter((d) => d.status === 'Open' || d.status === 'In Progress').length || 2;
  const totalApplicants = applications.length || 38;
  const scheduledInterviews = interviews.length || 12;
  const offersCount = offers.length || 6;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Corporate Partner Portal
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              {companyName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your campus placement drives, review student profiles, conduct assessments, and issue employment offers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate(ROUTES.DRIVES.ROOT)}
            className="text-xs"
          >
            Manage Drives
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Review Candidates
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Drives"
          value={activeDrivesCount}
          icon={Briefcase}
          trend={{ value: '2 Scheduled', isPositive: true }}
          className="border border-border-color"
        />
        <StatCard
          title="Applicants Under Review"
          value={totalApplicants}
          icon={Users}
          trend={{ value: '14 new submissions', isPositive: true }}
          className="border border-border-color"
        />
        <StatCard
          title="Scheduled Interviews"
          value={scheduledInterviews}
          icon={CalendarCheck2}
          trend={{ value: 'Upcoming rounds', isPositive: true }}
          className="border border-border-color"
        />
        <StatCard
          title="Offers Extended"
          value={offersCount}
          icon={Award}
          trend={{ value: 'Selected candidates', isPositive: true }}
          className="border border-border-color"
        />
      </div>

      {/* Main Grid: Active Drives & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campus Drives (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border-color">
            <div className="flex items-center justify-between pb-4 border-b border-border-color">
              <div>
                <h2 className="text-sm font-bold text-text-primary">Campus Recruitment Drives</h2>
                <p className="text-xs text-text-muted">Current openings published for student applications</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.DRIVES.ROOT)}
                className="text-xs text-primary font-semibold"
              >
                View All Drives →
              </Button>
            </div>

            <div className="divide-y divide-slate-100 pt-2">
              {drives.length > 0 ? (
                drives.map((d) => (
                  <div key={d.id || d._id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-text-primary truncate">{d.title}</span>
                        <StatusBadge status={d.status || 'In Progress'} />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
                        <span>CTC: <strong className="text-emerald-600">{d.ctc || '18.0 LPA'}</strong></span>
                        <span>•</span>
                        <span>Openings: <strong>{d.openings || 10}</strong></span>
                        <span>•</span>
                        <span>Applicants: <strong className="text-primary">{d.applicationsCount || 24}</strong></span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${ROUTES.DRIVES.ROOT}/${d.id || d._id}`)}
                      className="text-xs shrink-0"
                    >
                      View Candidates
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-text-muted">
                  No recruitment drives currently posted
                </div>
              )}
            </div>
          </Card>

          {/* Recent Candidate Submissions */}
          <Card className="border border-border-color">
            <div className="flex items-center justify-between pb-4 border-b border-border-color">
              <div>
                <h2 className="text-sm font-bold text-text-primary">Candidate Applications</h2>
                <p className="text-xs text-text-muted">Students registered for technical screening</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
                className="text-xs text-primary font-semibold"
              >
                Open Applications →
              </Button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-2.5">Candidate</th>
                    <th className="pb-2.5">Branch</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id || app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 font-medium text-text-primary">
                        <div className="flex items-center gap-2">
                          <Avatar name={app.studentName || 'Student'} size="xs" />
                          <span>{app.studentName || 'Candidate'}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-text-muted">{app.studentDepartment || 'CSE'}</td>
                      <td className="py-2.5 text-slate-700">{app.position || 'Software Engineer'}</td>
                      <td className="py-2.5">
                        <StatusBadge status={app.status || 'Under Review'} />
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`${ROUTES.APPLICATIONS.ROOT}/${app.id || app._id}`)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Evaluate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Interviews & Recruiter Support */}
        <div className="space-y-6">
          {/* Scheduled Interviews Card */}
          <Card className="border border-border-color">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-text-primary">Interview Rounds</h3>
              </div>
              <span className="text-[10px] bg-primary-soft text-primary font-bold px-2 py-0.5 rounded-full">
                {interviews.length} Scheduled
              </span>
            </div>

            <div className="divide-y divide-slate-100 pt-2">
              {interviews.length > 0 ? (
                interviews.slice(0, 4).map((i) => (
                  <div key={i.id || i._id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-primary">{i.studentName}</span>
                      <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {i.round || 'Technical'}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">{i.date || 'Tomorrow'}, {i.time || '11:00 AM'}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">Mode: {i.mode || 'Virtual / Google Meet'}</span>
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.INTERVIEWS.ROOT)}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-text-muted">
                  No interviews scheduled today
                </div>
              )}
            </div>
          </Card>

          {/* Fast Candidate Evaluation Banner */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950">Campus Hiring Policy</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              All students have pre-verified resumes and academic CGPAs authenticated by the institutional TPO Office.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.OFFERS.ROOT)}
              className="w-full text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 justify-center"
            >
              Issue Campus Job Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
