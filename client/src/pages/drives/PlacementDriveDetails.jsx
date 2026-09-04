import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Users,
  Award,
  GraduationCap,
  CheckCircle2,
  FileCheck2,
  Edit2,
  Trash2,
  ArrowLeft,
  Plus,
  Send,
  ExternalLink,
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
import Modal from '../../components/common/Modal';
import { driveService } from '../../services/driveService';
import { studentService } from '../../services/studentService';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const PlacementDriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [drive, setDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [students, setStudents] = useState([]);

  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  const fetchDriveData = async () => {
    try {
      setLoading(true);
      const data = await driveService.getById(id);
      setDrive(data);

      const [apps, ints, studentsData] = await Promise.all([
        driveService.getDriveApplications(data.id),
        driveService.getDriveInterviews(data.id, data.companyName),
        studentService.getAll({ limit: 50 })
      ]);

      setApplications(apps);
      setInterviews(ints);
      setStudents(studentsData.students || []);
      if (studentsData.students?.length > 0) {
        setSelectedStudentId(studentsData.students[0].id);
      }
    } catch (err) {
      console.error('Error loading placement drive details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDriveData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await driveService.delete(drive.id);
      navigate(ROUTES.DRIVES.ROOT);
    } catch (err) {
      console.error('Error deleting placement drive:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplyStudent = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    try {
      setApplying(true);
      await driveService.applyToDrive(drive.id, student);
      setApplySuccess(`Application successfully submitted for ${student.fullName}!`);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess('');
        fetchDriveData();
      }, 1200);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loading message="Loading placement drive details & applicants..." className="py-24" />;
  }

  if (!drive) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Drive Not Found"
          breadcrumbs={[{ label: 'Placement Drives', to: ROUTES.DRIVES.ROOT }, { label: 'Not Found' }]}
        />
        <Card className="p-12 text-center">
          <EmptyState
            title="Placement drive does not exist"
            description="The placement drive you are searching for was removed or not found."
            actionLabel="Back to Drives"
            onAction={() => navigate(ROUTES.DRIVES.ROOT)}
            actionIcon={ArrowLeft}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Breadcrumbs & Action Buttons */}
      <PageHeader
        title={drive.title}
        subtitle={`${drive.driveId} • ${drive.companyName}`}
        breadcrumbs={[
          { label: 'Placement Drives', to: ROUTES.DRIVES.ROOT },
          { label: drive.title }
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(ROUTES.DRIVES.ROOT)}
              className="text-xs"
            >
              Back to Drives
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => setShowApplyModal(true)}
              className="text-xs font-semibold"
            >
              {isStudent ? 'Apply for this Drive' : 'Register Candidate'}
            </Button>

            {!isStudent && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => navigate(ROUTES.DRIVES.EDIT(drive.id))}
                  className="text-xs"
                >
                  Edit Drive
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
            )}
          </>
        }
      />

      {/* 2. Top Hero Drive Banner */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar
            src={drive.companyLogo}
            name={drive.companyName}
            size="xl"
            className="rounded-2xl ring-4 ring-slate-50 shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {drive.title}
              </h2>
              <StatusBadge status={drive.status} size="md" />
              <Badge variant="primary" size="sm">
                {drive.jobType}
              </Badge>
            </div>

            <p className="text-xs text-text-muted">
              Hiring at{' '}
              <Link
                to={drive.companyId ? ROUTES.COMPANIES.DETAILS(drive.companyId) : ROUTES.COMPANIES.ROOT}
                className="font-semibold text-primary hover:underline"
              >
                {drive.companyName}
              </Link>{' '}
              • {drive.location}
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
              <span className="flex items-center gap-1 font-bold text-slate-800 text-sm">
                <IndianRupee className="w-4 h-4 text-primary" />
                {drive.ctc}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{drive.openings} Openings</span>
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Deadline: {formatDate(drive.applicationDeadline)}</span>
                <span className="text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                  ({formatRelativeTime(drive.applicationDeadline)})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Applications Count Card */}
        <div className="bg-primary-soft/40 border border-primary-200/60 rounded-xl p-4 md:text-right shrink-0">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
            Candidate Pipeline
          </span>
          <p className="text-xl font-bold text-text-primary mt-0.5">
            {drive.applicationsCount || applications.length} Applicants
          </p>
          <span className="text-[11px] text-text-muted mt-0.5 block">
            {drive.shortlistedCount || 0} Shortlisted candidates
          </span>
        </div>
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Eligibility & Selection Process */}
        <div className="lg:col-span-1 space-y-6">
          {/* Eligibility Criteria */}
          <Card title="Eligibility Criteria" subtitle="Candidate academic qualification parameters">
            <div className="divide-y divide-border-color/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Minimum CGPA</span>
                <span className="font-bold text-text-primary text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {drive.eligibility?.minCgpa || 7.0} / 10.0
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Max Allowed Backlogs</span>
                <span className="font-semibold text-slate-700">
                  {drive.eligibility?.maxBacklogs === 0 ? '0 (Zero Backlogs)' : `${drive.eligibility?.maxBacklogs} Backlogs`}
                </span>
              </div>
              <div className="py-2.5">
                <span className="text-text-muted block mb-1.5">Eligible Departments</span>
                <div className="flex flex-wrap gap-1">
                  {drive.eligibility?.departments?.map((dept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200/60"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Target Courses</span>
                <span className="font-medium text-text-primary">
                  {drive.eligibility?.courses?.join(', ') || 'B.Tech'}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Graduation Batches</span>
                <span className="font-medium text-text-primary">
                  {drive.eligibility?.batches?.join(', ') || '2021-2025'}
                </span>
              </div>
            </div>
          </Card>

          {/* Selection Process Roadmap */}
          <Card title="Selection Process" subtitle="Sequential evaluation and interview rounds">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {drive.selectionProcess && drive.selectionProcess.length > 0 ? (
                drive.selectionProcess.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary border-2 border-white flex items-center justify-center ring-2 ring-primary/20 text-[9px] font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-text-primary leading-tight">{step}</p>
                    <span className="text-[10px] text-text-muted block mt-0.5">Round {idx + 1}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-muted italic">Standard hiring process</p>
              )}
            </div>
          </Card>

          {/* Job Overview & Package Breakup */}
          <Card title="Compensation & Description" subtitle="Role requirements and salary structure">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-text-muted text-[11px] block">Salary Breakup</span>
                <p className="font-medium text-text-primary mt-0.5">
                  {drive.salaryBreakup || `Gross Annual CTC: ${drive.ctc}`}
                </p>
              </div>

              {drive.description && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-text-muted text-[11px] block mb-1">About the Role</span>
                  <p className="text-text-secondary leading-relaxed">{drive.description}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Applicants & Scheduled Interviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Table */}
          <Card
            title="Candidate Applications"
            subtitle="Students registered and undergoing evaluation for this drive"
            action={
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setShowApplyModal(true)}
                className="text-xs"
              >
                Register Candidate
              </Button>
            }
            padding={false}
          >
            {applications && applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">CGPA</th>
                      <th className="px-4 py-3">Current Stage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/70 text-text-primary">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={app.studentAvatar} name={app.studentName} size="sm" />
                            <div>
                              <Link
                                to={ROUTES.STUDENTS.DETAILS(app.studentId)}
                                className="font-semibold text-text-primary hover:text-primary transition-colors block"
                              >
                                {app.studentName}
                              </Link>
                              <span className="text-[11px] text-text-muted">{app.studentEmail}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-medium text-text-secondary">
                          {app.studentDepartment}
                        </td>

                        <td className="px-4 py-3.5 font-bold text-text-primary">
                          {app.studentCgpa || '—'}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                            {app.currentStage}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <StatusBadge status={app.status} size="sm" />
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.APPLICATIONS.DETAILS(app.id))}
                            className="text-xs py-1 px-2.5"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No candidate applications yet"
                  description="Eligible students can submit their profiles or be registered by the TPO."
                  actionLabel="Register Candidate"
                  onAction={() => setShowApplyModal(true)}
                />
              </div>
            )}
          </Card>

          {/* Scheduled Assessment / Interviews for this drive */}
          <Card
            title="Scheduled Interviews & Assessment Slots"
            subtitle="Interview appointments configured for this drive"
            padding={false}
          >
            {interviews && interviews.length > 0 ? (
              <div className="divide-y divide-border-color/70 text-xs">
                {interviews.map((int) => (
                  <div key={int.id} className="p-4 hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar src={int.studentAvatar} name={int.studentName} size="md" className="shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary">{int.studentName}</span>
                          <span className="text-[10px] bg-primary-soft text-primary font-medium px-1.5 py-0.2 rounded">
                            {int.round}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Interviewer: <span className="text-text-secondary font-medium">{int.interviewer}</span>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(int.date)}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {int.startTime} - {int.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 shrink-0">
                      {int.mode}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No interviews scheduled"
                  description="Interview slots will appear once shortlisting is finalized."
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Submit Application Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Register Student Application"
        subtitle={`Apply on behalf of a student for ${drive.title} at ${drive.companyName}`}
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowApplyModal(false)} disabled={applying}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={handleApplyStudent}
              loading={applying}
            >
              Submit Application
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyStudent} className="space-y-4 text-xs">
          {applySuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {applySuccess}
            </div>
          )}

          {applyError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium">
              {applyError}
            </div>
          )}

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Select Registered Student <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentId}) • {s.deptCode} • CGPA {s.cgpa}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-text-primary block">Drive Cut-off Verification</span>
            <p className="text-[11px] text-text-muted">
              Minimum CGPA required: <strong>{drive.eligibility?.minCgpa}</strong> | Max Backlogs: <strong>{drive.eligibility?.maxBacklogs}</strong>
            </p>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Placement Drive"
        message={`Are you sure you want to permanently delete the drive ${drive.title} at ${drive.companyName}?`}
        confirmLabel="Delete Drive"
        loading={isDeleting}
      />
    </div>
  );
};

export default PlacementDriveDetails;
