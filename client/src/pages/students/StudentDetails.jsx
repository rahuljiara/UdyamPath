import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Edit2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  IndianRupee,
  ShieldCheck
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
import { studentService } from '../../services/studentService';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const data = await studentService.getById(id);
        setStudent(data);

        const apps = await studentService.getStudentApplications(data.id);
        setApplications(apps);
      } catch (err) {
        console.error('Error loading student details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await studentService.delete(student.id);
      navigate(ROUTES.STUDENTS.ROOT);
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading student profile & application history..." className="py-24" />;
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Not Found"
          breadcrumbs={[{ label: 'Students', to: ROUTES.STUDENTS.ROOT }, { label: 'Not Found' }]}
        />
        <Card className="p-12 text-center">
          <EmptyState
            title="Student record does not exist"
            description="The student profile you are trying to view was removed or not found."
            actionLabel="Back to Students"
            onAction={() => navigate(ROUTES.STUDENTS.ROOT)}
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
        title={student.fullName}
        subtitle={`${student.studentId} • ${student.department}`}
        breadcrumbs={[
          { label: 'Students', to: ROUTES.STUDENTS.ROOT },
          { label: student.fullName }
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(ROUTES.STUDENTS.ROOT)}
              className="text-xs"
            >
              Back to Students
            </Button>

            {!isStudent ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => navigate(ROUTES.STUDENTS.EDIT(student.id))}
                  className="text-xs"
                >
                  Edit Profile
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
              (student.id === currentUser?.id || student.email === currentUser?.email) && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit2}
                  onClick={() => navigate(ROUTES.PROFILE)}
                  className="text-xs"
                >
                  Edit My Profile
                </Button>
              )
            )}
          </>
        }
      />

      {/* 2. Top Profile Hero Card */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar
            src={student.avatar}
            name={student.fullName}
            size="xl"
            className="ring-4 ring-slate-50 shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {student.fullName}
              </h2>
              <StatusBadge status={student.placementStatus} size="md" />
              {student.isEligible ? (
                <Badge variant="success" size="sm" dot>
                  Drive Eligible
                </Badge>
              ) : (
                <Badge variant="danger" size="sm" dot>
                  Not Eligible
                </Badge>
              )}
            </div>

            <p className="text-xs text-text-muted">
              <span className="font-semibold text-text-secondary">{student.department}</span> ({student.deptCode}) • {student.course} ({student.batch})
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${student.email}`} className="text-primary hover:underline font-medium">
                  {student.email}
                </a>
              </span>

              {student.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-text-secondary">{student.phone}</span>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Roll: <strong className="text-text-primary font-mono">{student.studentId}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Placement Offer Highlight (if Placed) */}
        {student.placementStatus === 'Placed' && student.placedCompany && (
          <div className="bg-primary-soft/50 border border-primary-200/60 rounded-xl p-4 md:text-right shrink-0">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
              Placement Secured
            </span>
            <p className="text-sm font-bold text-text-primary mt-0.5">{student.placedCompany}</p>
            {student.placedPackage && (
              <p className="text-xs font-semibold text-primary flex items-center md:justify-end gap-1 mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {student.placedPackage}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Skill Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Academic Information */}
          <Card title="Academic Profile" subtitle="Semester & examination performance">
            <div className="divide-y divide-border-color/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Degree / Course</span>
                <span className="font-semibold text-text-primary">{student.course}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Graduation Batch</span>
                <span className="font-semibold text-text-primary">{student.batch}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Current Semester</span>
                <span className="font-semibold text-text-primary">Semester {student.semester}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Cumulative CGPA</span>
                <span className="font-bold text-text-primary text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {student.cgpa} / 10.0
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Active Backlogs</span>
                <span className={`font-semibold ${student.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {student.backlogs} Backlog{student.backlogs !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </Card>

          {/* Technical Skills & Languages */}
          <Card title="Skills & Competencies" subtitle="Domain and programming skills">
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-text-secondary mb-2">Technical Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills && student.skills.length > 0 ? (
                    student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/70"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-muted italic">No skills listed</span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold text-text-secondary mb-2">Programming Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.programmingLanguages && student.programmingLanguages.length > 0 ? (
                    student.programmingLanguages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-md bg-primary-soft text-primary-dark font-medium border border-primary-200/60"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-muted italic">No languages listed</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Online Links & Resume */}
          <Card title="Profiles & Documents" subtitle="Verified portfolio and resume">
            <div className="space-y-3 text-xs">
              {student.resumeUrl ? (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-border-color hover:border-primary hover:bg-primary-soft/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      Resume (PDF)
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                </a>
              ) : (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-text-muted text-center">
                  No resume uploaded
                </div>
              )}

              {student.github && (
                <a
                  href={student.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-slate-700" />
                    <span className="text-text-primary font-medium truncate">{student.github.replace('https://', '')}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              {student.linkedin && (
                <a
                  href={student.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-text-primary font-medium truncate">{student.linkedin.replace('https://', '')}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              {student.portfolio && (
                <a
                  href={student.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-text-primary font-medium truncate">{student.portfolio.replace('https://', '')}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Applications & Placement Journey */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Table Card */}
          <Card
            title="Campus Placement Applications"
            subtitle="Record of drives applied, recruitment stages, and outcomes"
            padding={false}
          >
            {applications && applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3">Company & Position</th>
                      <th className="px-4 py-3">Applied On</th>
                      <th className="px-4 py-3">Current Stage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/70 text-text-primary">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-text-primary">{app.companyName}</p>
                          <p className="text-[11px] text-text-muted">{app.position}</p>
                        </td>

                        <td className="px-4 py-3.5 text-text-muted">
                          {formatDate(app.appliedAt)}
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
                  title="No applications recorded"
                  description="This student has not yet applied for any active placement drives."
                />
              </div>
            )}
          </Card>

          {/* Placement Journey Timeline */}
          <Card
            title="Placement Lifecycle Timeline"
            subtitle="Chronological milestones from registration to placement offer"
          >
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Registered */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary border-2 border-white flex items-center justify-center ring-2 ring-primary/20" />
                <h4 className="text-xs font-bold text-text-primary">Profile Registered & Academic Verification</h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Academic details verified by TPO Office. CGPA {student.cgpa} validated.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Session 2024-2025</span>
              </div>

              {/* Step 2: Drive Applications */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center ring-2 ring-sky-500/20" />
                <h4 className="text-xs font-bold text-text-primary">Participated in Placement Drives</h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Applied for eligible drives matching minimum cutoff score.
                </p>
              </div>

              {/* Step 3: Current Status */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                  student.placementStatus === 'Placed' ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-amber-500 ring-2 ring-amber-500/20'
                }`} />
                <h4 className="text-xs font-bold text-text-primary">
                  Current Status: {student.placementStatus}
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {student.placementStatus === 'Placed'
                    ? `Successfully placed at ${student.placedCompany} with ${student.placedPackage} CTC package.`
                    : 'Candidate is actively participating in ongoing recruitment drives.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete the profile for ${student.fullName}?`}
        confirmLabel="Delete Record"
        loading={isDeleting}
      />
    </div>
  );
};

export default StudentDetails;
