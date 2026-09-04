import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  Building2,
  User,
  GraduationCap,
  Calendar,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UpdateStatusModal from '../../components/applications/UpdateStatusModal';
import { applicationService } from '../../services/applicationService';
import { studentService } from '../../services/studentService';
import { driveService } from '../../services/driveService';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const stageSteps = [
  { id: 'Application', label: 'Application Submitted', desc: 'Initial candidate profile submission' },
  { id: 'Aptitude Test', label: 'Aptitude / Online Assessment', desc: 'Cognitive & coding assessment' },
  { id: 'Technical Test', label: 'Technical Assessment', desc: 'Domain coding / hackathon' },
  { id: 'Technical Interview', label: 'Technical Interview', desc: 'Live problem solving & system design' },
  { id: 'HR Interview', label: 'HR / Leadership Round', desc: 'Culture fit & behavioral assessment' },
  { id: 'Final Selection', label: 'Final Selection & Offer', desc: 'Offer letter confirmation' }
];

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [student, setStudent] = useState(null);
  const [drive, setDrive] = useState(null);

  // Modals state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      const appData = await applicationService.getById(id);
      setApplication(appData);

      // Load related student and drive if available
      try {
        if (appData.studentId) {
          const studentData = await studentService.getById(appData.studentId);
          setStudent(studentData);
        }
      } catch (e) {
        console.warn('Student record not found for application:', e);
      }

      try {
        if (appData.driveId) {
          const driveData = await driveService.getById(appData.driveId);
          setDrive(driveData);
        }
      } catch (e) {
        console.warn('Drive record not found for application:', e);
      }
    } catch (err) {
      console.error('Error fetching application details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplicationData();
    }
  }, [id]);

  const handleStatusUpdate = async (updateData) => {
    try {
      setUpdatingStatus(true);
      const updated = await applicationService.updateStatus(application.id, updateData);
      setApplication(updated);
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await applicationService.delete(application.id);
      navigate(ROUTES.APPLICATIONS.ROOT);
    } catch (err) {
      console.error('Error deleting application:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading application lifecycle & evaluations..." className="py-24" />;
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Application Not Found"
          breadcrumbs={[{ label: 'Applications', to: ROUTES.APPLICATIONS.ROOT }, { label: 'Not Found' }]}
        />
        <Card className="p-12 text-center">
          <EmptyState
            title="Application record does not exist"
            description="The candidate application was removed or does not exist."
            actionLabel="Back to Applications"
            onAction={() => navigate(ROUTES.APPLICATIONS.ROOT)}
            actionIcon={ArrowLeft}
          />
        </Card>
      </div>
    );
  }

  const currentStageIndex = stageSteps.findIndex((s) => s.id === application.currentStage);

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Breadcrumbs & Action Buttons */}
      <PageHeader
        title={`Application ${application.applicationId}`}
        subtitle={`${application.studentName} for ${application.position} at ${application.companyName}`}
        breadcrumbs={[
          { label: 'Applications', to: ROUTES.APPLICATIONS.ROOT },
          { label: application.applicationId }
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
              className="text-xs"
            >
              Back to Applications
            </Button>

            {!isStudent ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setShowStatusModal(true)}
                  className="text-xs font-semibold"
                >
                  Update Progression
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs"
                >
                  Delete
                </Button>
              </>
            ) : (
              (application.studentId === currentUser?.id || application.studentName === currentUser?.name) && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs"
                >
                  Withdraw Application
                </Button>
              )
            )}
          </>
        }
      />

      {/* 2. Top Hero Candidate Application Card */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar
            src={application.studentAvatar}
            name={application.studentName}
            size="xl"
            className="ring-4 ring-slate-50 shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {application.studentName}
              </h2>
              <StatusBadge status={application.status} size="md" />
              <Badge variant="primary" size="sm">
                {application.currentStage}
              </Badge>
            </div>

            <p className="text-xs text-text-muted">
              Applied for <strong className="text-text-primary font-semibold">{application.position}</strong> at{' '}
              <strong className="text-text-primary font-semibold">{application.companyName}</strong>
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Submitted: {formatDate(application.appliedAt)}</span>
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{application.studentDepartment} • CGPA {application.studentCgpa || '—'}</span>
              </span>

              {application.studentEmail && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-text-secondary">{application.studentEmail}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Cross-Link Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.STUDENTS.DETAILS(application.studentId))}
            className="text-xs py-1.5"
          >
            View Student Profile
          </Button>
          {application.driveId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.DRIVES.DETAILS(application.driveId))}
              className="text-xs py-1.5"
            >
              View Placement Drive
            </Button>
          )}
        </div>
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Academic Snapshot & Evaluator Notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Candidate Academic Profile */}
          <Card title="Candidate Academic Snapshot" subtitle="Key eligibility and credentials">
            <div className="divide-y divide-border-color/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Student Name</span>
                <span className="font-semibold text-text-primary">{application.studentName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Department</span>
                <span className="font-semibold text-text-primary">{application.studentDepartment}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Cumulative CGPA</span>
                <span className="font-bold text-text-primary text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {application.studentCgpa || '—'} / 10.0
                </span>
              </div>
              {student && (
                <>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Graduation Batch</span>
                    <span className="font-medium text-text-primary">{student.batch}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Active Backlogs</span>
                    <span className={`font-semibold ${student.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {student.backlogs}
                    </span>
                  </div>
                </>
              )}
            </div>

            {student?.resumeUrl && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-primary-soft/30 hover:border-primary transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-text-primary group-hover:text-primary">
                      Verified Resume (PDF)
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                </a>
              </div>
            )}
          </Card>

          {/* Evaluator Notes & Feedback */}
          <Card
            title="TPO & Evaluation Feedback"
            subtitle="Stage comments and interview ratings"
            action={
              !isStudent ? (
                <button
                  type="button"
                  onClick={() => setShowStatusModal(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Edit Notes
                </button>
              ) : undefined
            }
          >
            <div className="space-y-3 text-xs">
              {application.notes ? (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-text-secondary leading-relaxed">
                  {application.notes}
                </div>
              ) : (
                <p className="text-text-muted italic">No evaluation notes entered yet.</p>
              )}

              {application.rejectionReason && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 leading-relaxed">
                  <strong className="block font-semibold mb-1">Rejection Reason:</strong>
                  {application.rejectionReason}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Recruitment Stage Progression Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Recruitment Stage Progression"
            subtitle="Candidate evaluation lifecycle from application to final offer"
            action={
              !isStudent ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setShowStatusModal(true)}
                  className="text-xs"
                >
                  Change Stage
                </Button>
              ) : undefined
            }
          >
            <div className="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 text-xs">
              {stageSteps.map((step, idx) => {
                const isPassed = currentStageIndex > idx || application.status === 'Selected';
                const isCurrent = currentStageIndex === idx && application.status !== 'Selected' && application.status !== 'Rejected';
                const isRejectedCurrent = currentStageIndex === idx && application.status === 'Rejected';

                return (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-[11px] ${
                        isPassed
                          ? 'bg-primary text-white ring-2 ring-primary/20'
                          : isCurrent
                          ? 'bg-sky-500 text-white ring-2 ring-sky-500/20 animate-pulse'
                          : isRejectedCurrent
                          ? 'bg-rose-500 text-white ring-2 ring-rose-500/20'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-bold ${
                            isCurrent
                              ? 'text-primary'
                              : isRejectedCurrent
                              ? 'text-rose-600'
                              : isPassed
                              ? 'text-text-primary'
                              : 'text-text-muted'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.2 rounded-full border border-sky-200">
                            Current Stage
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.2 rounded-full border border-emerald-200">
                            Cleared
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Drive & Role Summary Card */}
          {drive && (
            <Card title="Placement Drive Specifications" subtitle="Campaign parameters & CTC details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1">
                  <span className="text-text-muted text-[11px] block">Offered CTC</span>
                  <p className="text-base font-bold text-primary flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {drive.ctc}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1">
                  <span className="text-text-muted text-[11px] block">Vacancies</span>
                  <p className="text-base font-bold text-text-primary">
                    {drive.openings} Openings
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1">
                  <span className="text-text-muted text-[11px] block">Job Type</span>
                  <p className="text-base font-bold text-text-primary">
                    {drive.jobType}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        application={application}
        onUpdate={handleStatusUpdate}
        loading={updatingStatus}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Application Record"
        message={`Are you sure you want to remove this application for ${application.studentName}?`}
        confirmLabel="Delete Application"
        loading={isDeleting}
      />
    </div>
  );
};

export default ApplicationDetails;
