import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StudentForm from '../../components/students/StudentForm';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { studentService } from '../../services/studentService';
import { ROUTES } from '../../routes/paths';

const StudentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await studentService.getById(id);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student for edit:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSubmitting(true);
      const updated = await studentService.update(id, formData);
      navigate(ROUTES.STUDENTS.DETAILS(updated.id));
    } catch (err) {
      console.error('Error updating student:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading student details for editing..." className="py-24" />;
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Not Found"
          breadcrumbs={[{ label: 'Students', to: ROUTES.STUDENTS.ROOT }, { label: 'Edit' }]}
        />
        <EmptyState
          title="Student not found"
          description="The student record you are trying to edit was not found."
          actionLabel="Back to Students"
          onAction={() => navigate(ROUTES.STUDENTS.ROOT)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Edit ${student.fullName}`}
        subtitle={`Update academic records, scores, and placement status for ${student.studentId}`}
        breadcrumbs={[
          { label: 'Students', to: ROUTES.STUDENTS.ROOT },
          { label: student.fullName, to: ROUTES.STUDENTS.DETAILS(student.id) },
          { label: 'Edit' }
        ]}
      />

      <StudentForm
        initialData={student}
        onSubmit={handleUpdate}
        loading={submitting}
        isEdit={true}
      />
    </div>
  );
};

export default StudentEdit;
