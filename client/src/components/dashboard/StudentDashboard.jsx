import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileCheck2,
  CalendarCheck2,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Building2,
  AlertCircle,
  FileText,
  Video,
  ChevronRight
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

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  const [recommendedDrives, setRecommendedDrives] = useState([]);
  const [myInterviews, setMyInterviews] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [appliedDriveIds, setAppliedDriveIds] = useState(new Set());
  const [applySuccessMessage, setApplySuccessMessage] = useState('');

  const studentCgpa = currentUser?.cgpa || 9.42;
  const studentDept = currentUser?.deptCode || 'CSE';
  const studentName = currentUser?.name || 'Rahul Sharma';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, driveRes, intRes, offerRes] = await Promise.all([
          applicationService.getAll({ limit: 10 }),
          driveService.getAll({ limit: 6 }),
          interviewService.getAll({ limit: 5 }),
          placementService.getAllOffers({ limit: 5 })
        ]);

        // Filter personal data
        const personalApps = (appRes.applications || []).filter(
          (a) => a.studentId === currentUser?.id || a.studentName?.toLowerCase() === studentName.toLowerCase()
        );
        setMyApplications(personalApps);

        const appliedIds = new Set(personalApps.map((a) => a.driveId));
        setAppliedDriveIds(appliedIds);

        // Filter drives matching student branch and eligibility
        const drives = (driveRes.drives || []).map((d) => {
          const isEligible =
            (!d.eligibility?.minCgpa || studentCgpa >= d.eligibility.minCgpa) &&
            (!d.eligibility?.departments || d.eligibility.departments.some((dept) => dept.includes(studentDept) || dept.includes('Computer')));
          return {
            ...d,
            isEligible,
            hasApplied: appliedIds.has(d.id) || appliedIds.has(d.driveId)
          };
        });
        setRecommendedDrives(drives);

        // Filter interviews
        const personalInterviews = (intRes.interviews || []).filter(
          (i) => i.studentName?.toLowerCase() === studentName.toLowerCase()
        );
        setMyInterviews(personalInterviews);

        // Filter offers
        const personalOffers = (offerRes.offers || []).filter(
          (o) => o.studentName?.toLowerCase() === studentName.toLowerCase()
        );
        setMyOffers(personalOffers);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, studentCgpa, studentDept, studentName]);

  const handleApply = async (drive) => {
    try {
      await driveService.applyToDrive(drive.id, currentUser);
      setAppliedDriveIds((prev) => new Set([...prev, drive.id]));
      setApplySuccessMessage(`Successfully applied to ${drive.companyName} (${drive.title})!`);
      setTimeout(() => setApplySuccessMessage(''), 4000);
      // Refresh applications list
      const appRes = await applicationService.getAll({ limit: 10 });
      setMyApplications(
        (appRes.applications || []).filter(
          (a) => a.studentId === currentUser?.id || a.studentName?.toLowerCase() === studentName.toLowerCase()
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return <Loading text="Loading your candidate portal..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast message */}
      {applySuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{applySuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setApplySuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-soft/20 text-teal-200 border border-teal-400/30">
              Candidate Portal • Roll {currentUser?.studentId || '21BCS045'}
            </span>
            <span className="text-xs text-teal-100/80">
              {currentUser?.department} • CGPA: <strong>{studentCgpa}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hi, {studentName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-teal-100/90 max-w-xl">
            You are actively registered for campus placements. Explore matching job drives, track interview
            schedules, and manage your offer letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => navigate(ROUTES.PROFILE)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs py-2"
          >
            Update Resume & Skills
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Briefcase}
            onClick={() => navigate(ROUTES.DRIVES.ROOT)}
            className="text-xs py-2 shadow-sm bg-primary hover:bg-primary-hover text-white"
          >
            Explore Open Drives
          </Button>
        </div>
      </div>

      {/* 4 Personal Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Applied Drives"
          value={myApplications.length}
          subtitle="Submitted across companies"
          icon={Briefcase}
          color="primary"
          trend="up"
          trendValue="Active Candidate"
        />
        <StatCard
          title="Shortlisted / In Review"
          value={myApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Under Review').length}
          subtitle="Passed initial eligibility"
          icon={FileCheck2}
          color="sky"
          trend="neutral"
          trendValue="Ongoing Rounds"
        />
        <StatCard
          title="Scheduled Interviews"
          value={myInterviews.length}
          subtitle="Upcoming evaluation slots"
          icon={CalendarCheck2}
          color="amber"
          trend="up"
          trendValue="Action Required"
        />
        <StatCard
          title="Offers Received"
          value={myOffers.length}
          subtitle={myOffers.length > 0 ? `${myOffers[0].ctc} CTC` : 'Awaiting results'}
          icon={Award}
          color="emerald"
          trend="up"
          trendValue={myOffers.length > 0 ? 'Selected' : 'Target: Dream Offer'}
        />
      </div>

      {/* Upcoming Interview Alert (if any) */}
      {myInterviews.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900">Upcoming Interview</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  {myInterviews[0].round}
                </span>
              </div>
              <p className="text-xs text-text-primary font-medium">
                {myInterviews[0].companyName} • {myInterviews[0].position}
              </p>
              <p className="text-[11px] text-text-muted">
                📅 {myInterviews[0].date} at {myInterviews[0].time} • {myInterviews[0].mode} ({myInterviews[0].meetingLink || 'Conference Room 302'})
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowUpRight}
            onClick={() => navigate(ROUTES.INTERVIEWS.ROOT)}
            className="text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            View Interview Details
          </Button>
        </div>
      )}

      {/* Dual Section: My Active Applications Pipeline & Recommended Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Applications Pipeline */}
        <div className="lg:col-span-6">
          <Card
            title="My Applications & Stage Pipeline"
            subtitle="Track live status and stage progress of your campus applications"
            headerAction={
              <button
                type="button"
                onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Tracker</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            {myApplications.length > 0 ? (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-border-color hover:border-primary/40 bg-white transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{app.companyName}</p>
                        <p className="text-[11px] text-text-secondary">{app.position}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Visual Stage Progress Stepper */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-text-muted mb-1.5">
                        <span className="text-primary font-bold">1. Applied</span>
                        <span className={app.currentStage !== 'Application' ? 'text-primary font-bold' : ''}>
                          2. Shortlisted
                        </span>
                        <span className={app.currentStage === 'Technical Round' || app.currentStage === 'HR Round' || app.status === 'Selected' ? 'text-primary font-bold' : ''}>
                          3. Interviews
                        </span>
                        <span className={app.status === 'Selected' ? 'text-emerald-600 font-bold' : ''}>
                          4. Offer
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            app.status === 'Selected'
                              ? 'w-full bg-emerald-500'
                              : app.status === 'Rejected'
                              ? 'w-1/2 bg-rose-500'
                              : app.currentStage === 'HR Round'
                              ? 'w-3/4 bg-primary'
                              : app.currentStage === 'Technical Round'
                              ? 'w-2/3 bg-primary'
                              : app.status === 'Shortlisted'
                              ? 'w-1/2 bg-sky-500'
                              : 'w-1/4 bg-primary'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span className="text-text-muted font-medium">Stage: {app.currentStage || 'Application'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-text-primary">No Applications Yet</p>
                <p className="text-xs text-text-muted">Apply to matching placement drives below to start your journey.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Recommended Drives with 1-Click Apply */}
        <div className="lg:col-span-6">
          <Card
            title="Matching Placement Drives"
            subtitle="Campus hiring opportunities filtered for your branch & CGPA"
            headerAction={
              <button
                type="button"
                onClick={() => navigate(ROUTES.DRIVES.ROOT)}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-3">
              {recommendedDrives.slice(0, 4).map((drive) => {
                const hasApplied = appliedDriveIds.has(drive.id) || appliedDriveIds.has(drive.driveId);
                return (
                  <div
                    key={drive.id}
                    className="p-3.5 rounded-xl border border-border-color hover:border-primary/40 bg-white transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary-soft/60 flex items-center justify-center text-primary shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-text-primary truncate">{drive.companyName}</p>
                          {drive.isEligible ? (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                              Eligible
                            </span>
                          ) : (
                            <span className="text-[9px] bg-rose-50 text-rose-700 font-semibold px-1.5 py-0.2 rounded border border-rose-200">
                              CGPA &lt; {drive.eligibility?.minCgpa}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-secondary truncate">{drive.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <span className="text-primary font-semibold">{drive.salary || 'Competitive'}</span>
                          <span>•</span>
                          <span>{drive.location || 'Campus / Hybrid'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!drive.isEligible}
                          onClick={() => handleApply(drive)}
                          className="text-xs py-1 px-3"
                        >
                          1-Click Apply
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Offers Showcase (If student has received offers) */}
      {myOffers.length > 0 && (
        <Card
          title="🎉 Placement Offers & Letter Repository"
          subtitle="Official offer letters issued by recruiting partners"
        >
          <div className="divide-y divide-slate-100">
            {myOffers.map((offer) => (
              <div key={offer.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-text-primary">{offer.companyName}</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        {offer.status || 'Accepted'}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary">{offer.jobTitle} • {offer.location}</p>
                    <p className="text-xs font-bold text-primary">Package (CTC): {offer.ctc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                    onClick={() => navigate(ROUTES.OFFERS.ROOT)}
                    className="text-xs py-1.5 px-3"
                  >
                    View Offer Letter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
