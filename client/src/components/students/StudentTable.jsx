import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, IndianRupee } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const StudentTable = ({
  students = [],
  loading = false,
  onDelete,
  onResetFilters
}) => {
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching student records..." />
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No students found"
          description="Try adjusting your search criteria or filter options to find student records."
          actionLabel="Clear Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
              <th className="px-4 py-3.5">Student</th>
              <th className="px-4 py-3.5">Student ID</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Course / Batch</th>
              <th className="px-4 py-3.5">CGPA</th>
              <th className="px-4 py-3.5">Placement Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Student Avatar + Name + Email */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={student.avatar}
                      name={student.fullName}
                      size="md"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(student.id)}
                        className="font-semibold text-text-primary hover:text-primary transition-colors block truncate"
                      >
                        {student.fullName}
                      </Link>
                      <span className="text-[11px] text-text-muted truncate block">
                        {student.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Student ID */}
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                    {student.studentId}
                  </span>
                </td>

                {/* Department */}
                <td className="px-4 py-3.5">
                  <span className="font-medium text-text-primary block">{student.department}</span>
                  <span className="text-[11px] text-text-muted">{student.deptCode}</span>
                </td>

                {/* Course / Batch */}
                <td className="px-4 py-3.5">
                  <span className="text-text-primary font-medium">{student.course}</span>
                  <span className="text-[11px] text-text-muted block">
                    Sem {student.semester} • {student.batch}
                  </span>
                </td>

                {/* CGPA */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-text-primary text-sm">{student.cgpa}</span>
                    {student.backlogs > 0 ? (
                      <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-semibold">
                        {student.backlogs} backlog{student.backlogs > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-medium">
                        0 BL
                      </span>
                    )}
                  </div>
                </td>

                {/* Placement Status */}
                <td className="px-4 py-3.5">
                  <div className="space-y-1">
                    <StatusBadge status={student.placementStatus} size="sm" />
                    {student.placementStatus === 'Placed' && student.placedCompany && (
                      <div className="text-[11px] text-text-muted flex items-center gap-1 truncate max-w-[150px]">
                        <span className="font-medium text-text-secondary truncate">{student.placedCompany}</span>
                        {student.placedPackage && (
                          <span className="text-primary font-semibold text-[10px]">({student.placedPackage})</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.STUDENTS.DETAILS(student.id))}
                      className="text-xs py-1 px-2.5 flex items-center gap-1 text-primary border-primary/30 hover:bg-primary-soft/50"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Button>

                    {!isStudent ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.STUDENTS.EDIT(student.id))}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Edit Student"
                          aria-label="Edit Student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(student)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Student"
                          aria-label="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    ) : (
                      (student.id === currentUser?.id || student.email === currentUser?.email) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.PROFILE)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Edit My Profile"
                          aria-label="Edit My Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
