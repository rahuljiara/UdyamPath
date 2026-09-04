import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StudentForm from '../../components/students/StudentForm';
import { studentService } from '../../services/studentService';
import { ROUTES } from '../../routes/paths';

const StudentCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const newStudent = await studentService.create(formData);
      navigate(ROUTES.STUDENTS.DETAILS(newStudent.id));
    } catch (err) {
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Add New Student"
        subtitle="Register a student for the campus placement cohort"
        breadcrumbs={[
          { label: 'Students', to: ROUTES.STUDENTS.ROOT },
          { label: 'Add Student' }
        ]}
      />

      <StudentForm onSubmit={handleCreate} loading={loading} isEdit={false} />
    </div>
  );
};

export default StudentCreate;
