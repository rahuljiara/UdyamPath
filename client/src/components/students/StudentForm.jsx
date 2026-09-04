import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, GraduationCap, Link2, Briefcase } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { ROUTES } from '../../routes/paths';

const departmentsList = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'ECE', name: 'Electronics & Communication' },
  { code: 'EEE', name: 'Electrical & Electronics' },
  { code: 'MECH', name: 'Mechanical Engineering' }
];

const StudentForm = ({ initialData, onSubmit, loading = false, isEdit = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    studentId: initialData?.studentId || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || 'Male',
    dateOfBirth: initialData?.dateOfBirth || '',
    avatar: initialData?.avatar || '',
    department: initialData?.department || 'Computer Science & Engineering',
    deptCode: initialData?.deptCode || 'CSE',
    course: initialData?.course || 'B.Tech',
    batch: initialData?.batch || '2021-2025',
    semester: initialData?.semester || 8,
    cgpa: initialData?.cgpa || '',
    backlogs: initialData?.backlogs !== undefined ? initialData.backlogs : 0,
    isEligible: initialData?.isEligible !== undefined ? initialData.isEligible : true,
    skills: Array.isArray(initialData?.skills) ? initialData.skills.join(', ') : initialData?.skills || '',
    programmingLanguages: Array.isArray(initialData?.programmingLanguages)
      ? initialData.programmingLanguages.join(', ')
      : initialData?.programmingLanguages || '',
    resumeUrl: initialData?.resumeUrl || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    portfolio: initialData?.portfolio || '',
    placementStatus: initialData?.placementStatus || 'Unplaced',
    placedCompany: initialData?.placedCompany || '',
    placedPackage: initialData?.placedPackage || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto set deptCode when department changes
      if (name === 'department') {
        const found = departmentsList.find((d) => d.name === value);
        if (found) updated.deptCode = found.code;
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID / Roll No is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (formData.cgpa === '' || isNaN(formData.cgpa) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      errs.cgpa = 'Enter valid CGPA between 0.00 and 10.00';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      cgpa: Number(formData.cgpa),
      backlogs: Number(formData.backlogs) || 0,
      semester: Number(formData.semester) || 8
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Personal Information */}
      <Card
        title="Personal Information"
        subtitle="Basic student identification and contact details"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Rahul"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.firstName ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.firstName && <p className="text-rose-500 text-[11px] mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Sharma"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Student ID / Roll No <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 2021CSE084"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.studentId ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.studentId && <p className="text-rose-500 text-[11px] mt-1">{errors.studentId}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              College Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul.s@college.edu.in"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-text-secondary mb-1">Avatar Image URL (Optional)</label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </Card>

      {/* 2. Academic Information */}
      <Card
        title="Academic Information"
        subtitle="Department, course, batch, semester, and academic scores"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {departmentsList.map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Course</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Graduation Batch</label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="2021-2025">2021-2025 (Final Year)</option>
              <option value="2022-2026">2022-2026 (Third Year)</option>
              <option value="2020-2024">2020-2024 (Graduated)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Current Semester</label>
            <input
              type="number"
              name="semester"
              min="1"
              max="8"
              value={formData.semester}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Cumulative CGPA (10.0 scale) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.75"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.cgpa ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.cgpa && <p className="text-rose-500 text-[11px] mt-1">{errors.cgpa}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Active Backlogs</label>
            <input
              type="number"
              min="0"
              name="backlogs"
              value={formData.backlogs}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isEligible"
                checked={formData.isEligible}
                onChange={handleChange}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="font-medium text-text-primary">
                Mark as Eligible for Placement Drives (cleared college criteria)
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* 3. Skills & Professional Links */}
      <Card
        title="Skills & Profiles"
        subtitle="Technical competencies, portfolio, resume, and coding profiles"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Technical Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React.js, Node.js, MongoDB, Docker, AWS"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Programming Languages (comma-separated)
            </label>
            <input
              type="text"
              name="programmingLanguages"
              value={formData.programmingLanguages}
              onChange={handleChange}
              placeholder="Java, Python, C++, JavaScript"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Resume PDF URL</label>
            <input
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://example.com/resumes/my-resume.pdf"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">GitHub Profile URL</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Portfolio Website URL</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://myportfolio.dev"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </Card>

      {/* 4. Placement Status */}
      <Card
        title="Placement Status"
        subtitle="Current status, offer details, and placed company"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">Placement Status</label>
            <select
              name="placementStatus"
              value={formData.placementStatus}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Unplaced">Unplaced</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Placed">Placed</option>
              <option value="Ineligible">Ineligible</option>
            </select>
          </div>

          {formData.placementStatus === 'Placed' && (
            <>
              <div>
                <label className="block font-medium text-text-secondary mb-1">Placed Company</label>
                <input
                  type="text"
                  name="placedCompany"
                  value={formData.placedCompany}
                  onChange={handleChange}
                  placeholder="e.g. Microsoft India"
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">Placed Package (CTC)</label>
                <input
                  type="text"
                  name="placedPackage"
                  value={formData.placedPackage}
                  onChange={handleChange}
                  placeholder="e.g. 44.0 LPA"
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEdit && initialData?.id ? ROUTES.STUDENTS.DETAILS(initialData.id) : ROUTES.STUDENTS.ROOT)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          loading={loading}
        >
          {isEdit ? 'Save Changes' : 'Register Student'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
