import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Users,
  Briefcase,
  Award,
  Edit2,
  Trash2,
  ArrowLeft,
  Plus,
  ExternalLink,
  IndianRupee,
  Clock,
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
import { companyService } from '../../services/companyService';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [drives, setDrives] = useState([]);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const data = await companyService.getById(id);
        setCompany(data);

        // Fetch related drives and placed students
        const [relatedDrives, students] = await Promise.all([
          companyService.getCompanyDrives(data.id, data.name),
          companyService.getCompanyPlacedStudents(data.name)
        ]);

        setDrives(relatedDrives);
        setPlacedStudents(students);
      } catch (err) {
        console.error('Error loading company details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await companyService.delete(company.id);
      navigate(ROUTES.COMPANIES.ROOT);
    } catch (err) {
      console.error('Error deleting company:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading company profile and recruitment drives..." className="py-24" />;
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Not Found"
          breadcrumbs={[{ label: 'Companies', to: ROUTES.COMPANIES.ROOT }, { label: 'Not Found' }]}
        />
        <Card className="p-12 text-center">
          <EmptyState
            title="Company partner does not exist"
            description="The company profile you are searching for was not found."
            actionLabel="Back to Companies"
            onAction={() => navigate(ROUTES.COMPANIES.ROOT)}
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
        title={company.name}
        subtitle={`${company.companyId} • ${company.industry}`}
        breadcrumbs={[
          { label: 'Companies', to: ROUTES.COMPANIES.ROOT },
          { label: company.name }
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(ROUTES.COMPANIES.ROOT)}
              className="text-xs"
            >
              Back to Companies
            </Button>

            {!isStudent && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => navigate(ROUTES.COMPANIES.EDIT(company.id))}
                  className="text-xs"
                >
                  Edit Company
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => navigate(ROUTES.DRIVES.CREATE)}
                  className="text-xs"
                >
                  Create Drive
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

      {/* 2. Top Company Hero Profile Card */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar
            src={company.logo}
            name={company.name}
            size="xl"
            className="rounded-2xl ring-4 ring-slate-50 shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {company.name}
              </h2>
              <StatusBadge status={company.status} size="md" />
              {company.tier && (
                <Badge variant="primary" size="sm">
                  {company.tier}
                </Badge>
              )}
            </div>

            <p className="text-xs text-text-muted">
              <span className="font-semibold text-text-secondary">{company.industry}</span> • {company.type}
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-text-secondary">{company.location}</span>
              </span>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{company.website.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{company.employeeCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Hires & CTC Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 md:text-right shrink-0">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Placement Record
          </span>
          <p className="text-base font-bold text-text-primary mt-0.5">
            {company.totalHires || 0} Total Hires
          </p>
          {company.averagePackage && (
            <p className="text-xs font-semibold text-primary flex items-center md:justify-end gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
              Avg {company.averagePackage}
            </p>
          )}
        </div>
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company Overview & Recruiter Contacts */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company Overview */}
          <Card title="About Company" subtitle="Organizational profile and operations">
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              {company.description || 'No detailed overview provided.'}
            </p>

            <div className="divide-y divide-border-color/60 text-xs border-t border-slate-100 pt-1">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Company Code</span>
                <span className="font-mono font-semibold text-text-primary">{company.companyId}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Headquarters</span>
                <span className="font-semibold text-text-primary">{company.city || company.location}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Workforce</span>
                <span className="font-semibold text-text-primary">{company.employeeCount}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-muted">Placement Tier</span>
                <span className="font-semibold text-primary">{company.tier || 'Standard'}</span>
              </div>
            </div>
          </Card>

          {/* Recruiter / HR Contact */}
          <Card title="Recruiter / HR Contact" subtitle="Campus recruitment coordinators">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-text-muted text-[11px] block">Contact Person</span>
                  <span className="font-semibold text-text-primary text-sm">
                    {company.contactPerson || 'Campus Hiring Team'}
                  </span>
                </div>
              </div>

              {company.contactEmail && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] block">Email Address</span>
                    <a
                      href={`mailto:${company.contactEmail}`}
                      className="font-medium text-primary hover:underline block break-all"
                    >
                      {company.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {company.contactPhone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] block">Contact Phone</span>
                    <span className="font-medium text-text-primary">{company.contactPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Recruitment Drives & Placed Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campus Placement Drives */}
          <Card
            title="Campus Placement Drives"
            subtitle="Recruitment campaigns conducted by this company"
            action={
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => navigate(ROUTES.DRIVES.CREATE)}
                className="text-xs"
              >
                Post Drive
              </Button>
            }
            padding={false}
          >
            {drives && drives.length > 0 ? (
              <div className="divide-y divide-border-color/70">
                {drives.map((drive) => (
                  <div
                    key={drive.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={ROUTES.DRIVES.DETAILS(drive.id)}
                          className="font-bold text-text-primary hover:text-primary transition-colors text-sm"
                        >
                          {drive.title}
                        </Link>
                        <StatusBadge status={drive.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-text-muted flex-wrap">
                        <span className="font-semibold text-slate-700">{drive.ctc}</span>
                        <span>•</span>
                        <span>{drive.jobType}</span>
                        <span>•</span>
                        <span>{drive.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-text-muted block">Applications</span>
                        <span className="font-bold text-text-primary">{drive.applicationsCount}</span>
                        <span className="text-text-muted"> / {drive.openings} Openings</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.DRIVES.DETAILS(drive.id))}
                        className="text-xs"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <EmptyState
                  title="No active drives found"
                  description="No recruitment drives have been created for this company yet."
                  actionLabel="Create Placement Drive"
                  onAction={() => navigate(ROUTES.DRIVES.CREATE)}
                />
              </div>
            )}
          </Card>

          {/* Selected / Placed Students */}
          <Card
            title="Placed Candidates"
            subtitle="Students who secured placement offers at this organization"
            padding={false}
          >
            {placedStudents && placedStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Batch</th>
                      <th className="px-4 py-3">Offered CTC</th>
                      <th className="px-4 py-3 text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/70 text-text-primary">
                    {placedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={student.avatar} name={student.fullName} size="sm" />
                            <div>
                              <Link
                                to={ROUTES.STUDENTS.DETAILS(student.id)}
                                className="font-semibold text-text-primary hover:text-primary transition-colors block"
                              >
                                {student.fullName}
                              </Link>
                              <span className="text-[11px] font-mono text-text-muted">{student.studentId}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-text-secondary">
                          {student.department} ({student.deptCode})
                        </td>

                        <td className="px-4 py-3.5 text-text-muted">
                          {student.batch}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-bold text-primary">{student.placedPackage || company.averagePackage || '—'}</span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.STUDENTS.DETAILS(student.id))}
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
                  title="No candidate records"
                  description="Placement records for this company will populate as recruitment rounds conclude."
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Company Partner"
        message={`Are you sure you want to permanently delete the profile for ${company.name}?`}
        confirmLabel="Delete Partner"
        loading={isDeleting}
      />
    </div>
  );
};

export default CompanyDetails;
