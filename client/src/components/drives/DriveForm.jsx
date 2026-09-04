import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Briefcase, GraduationCap, Building2, Calendar, IndianRupee, Layers } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { companyService } from '../../services/companyService';
import { ROUTES } from '../../routes/paths';

const departmentsList = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering'
];

const coursesList = ['B.Tech', 'M.Tech', 'MCA', 'BCA'];
const batchesList = ['2021-2025', '2022-2026', '2020-2024'];

const DriveForm = ({ initialData, onSubmit, loading = false, isEdit = false }) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    companyId: initialData?.companyId || '',
    companyName: initialData?.companyName || '',
    companyLogo: initialData?.companyLogo || '',
    jobType: initialData?.jobType || 'Full-Time',
    location: initialData?.location || '',
    ctc: initialData?.ctc || '',
    salaryBreakup: initialData?.salaryBreakup || '',
    openings: initialData?.openings || 10,
    applicationDeadline: initialData?.applicationDeadline
      ? initialData.applicationDeadline.slice(0, 10)
      : '2025-03-30',
    driveDate: initialData?.driveDate || '2025-04-05',
    status: initialData?.status || 'Open',
    description: initialData?.description || '',
    minCgpa: initialData?.eligibility?.minCgpa || 7.0,
    maxBacklogs: initialData?.eligibility?.maxBacklogs !== undefined ? initialData.eligibility.maxBacklogs : 0,
    departments: initialData?.eligibility?.departments || [
      'Computer Science & Engineering',
      'Information Technology'
    ],
    courses: initialData?.eligibility?.courses || ['B.Tech'],
    batches: initialData?.eligibility?.batches || ['2021-2025'],
    selectionProcess: Array.isArray(initialData?.selectionProcess)
      ? initialData.selectionProcess.join('\n')
      : initialData?.selectionProcess || 'Online Coding Assessment\nTechnical Round 1\nHR Interview'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getAll({ limit: 50 });
        setCompanies(data.companies || []);
        if (!formData.companyName && data.companies?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            companyId: data.companies[0].id,
            companyName: data.companies[0].name,
            companyLogo: data.companies[0].logo
          }));
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCompanySelect = (e) => {
    const selectedCompName = e.target.value;
    const found = companies.find((c) => c.name === selectedCompName);
    setFormData((prev) => ({
      ...prev,
      companyName: selectedCompName,
      companyId: found ? found.id : prev.companyId,
      companyLogo: found ? found.logo : prev.companyLogo
    }));
  };

  const handleCheckboxToggle = (category, value) => {
    setFormData((prev) => {
      const currentList = prev[category] || [];
      const updatedList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updatedList };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Job role / title is required';
    if (!formData.companyName.trim()) errs.companyName = 'Company is required';
    if (!formData.ctc.trim()) errs.ctc = 'Offered CTC package is required';
    if (!formData.location.trim()) errs.location = 'Job location is required';
    if (!formData.applicationDeadline) errs.applicationDeadline = 'Application deadline is required';
    if (formData.departments.length === 0) errs.departments = 'Select at least one eligible department';
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
      openings: Number(formData.openings) || 1,
      minCgpa: Number(formData.minCgpa) || 6.0,
      maxBacklogs: Number(formData.maxBacklogs) || 0,
      applicationDeadline: new Date(formData.applicationDeadline).toISOString()
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Drive Overview & Role */}
      <Card
        title="Job & Campaign Details"
        subtitle="Role designation, corporate sponsor, package, and locations"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Job Title / Designation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Software Development Engineer - 1"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.title && <p className="text-rose-500 text-[11px] mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Hiring Company <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.companyName}
              onChange={handleCompanySelect}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {companies.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Drive Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="Open">Open (Accepting Applications)</option>
              <option value="In Progress">In Progress (Assessment ongoing)</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              CTC Package (LPA) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              placeholder="e.g. 24.0 LPA"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.ctc ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.ctc && <p className="text-rose-500 text-[11px] mt-1">{errors.ctc}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Full-Time">Full-Time (FTE)</option>
              <option value="Internship">Internship</option>
              <option value="Intern + FTE">Intern + FTE Conversion</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Total Openings</label>
            <input
              type="number"
              min="1"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Job Location(s) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hyderabad / Bengaluru / Hybrid"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.location ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.location && <p className="text-rose-500 text-[11px] mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Application Deadline <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Drive / Assessment Date</label>
            <input
              type="date"
              name="driveDate"
              value={formData.driveDate}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-medium text-text-secondary mb-1">Salary Breakup / Retention Bonus</label>
            <input
              type="text"
              name="salaryBreakup"
              value={formData.salaryBreakup}
              onChange={handleChange}
              placeholder="e.g. Base: 16.0 LPA | Joining Bonus: 2.0 LPA | Stocks: 6.0 LPA"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-medium text-text-secondary mb-1">Job Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of responsibilities, technology stack, and expectations..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
            />
          </div>
        </div>
      </Card>

      {/* 2. Eligibility Criteria */}
      <Card
        title="Eligibility Criteria"
        subtitle="Cut-off parameters, eligible academic departments, and target batches"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Minimum Cumulative CGPA Cut-off
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleChange}
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Maximum Allowed Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                name="maxBacklogs"
                value={formData.maxBacklogs}
                onChange={handleChange}
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Departments Checkboxes */}
          <div>
            <label className="block font-semibold text-text-secondary mb-2">
              Eligible Departments <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {departmentsList.map((dept) => (
                <label
                  key={dept}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    formData.departments.includes(dept)
                      ? 'bg-primary-soft/50 border-primary text-primary font-medium'
                      : 'bg-white border-border-color text-text-primary hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.departments.includes(dept)}
                    onChange={() => handleCheckboxToggle('departments', dept)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
            {errors.departments && <p className="text-rose-500 text-[11px] mt-1">{errors.departments}</p>}
          </div>

          {/* Courses & Batches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-text-secondary mb-2">Eligible Courses</label>
              <div className="flex flex-wrap gap-2">
                {coursesList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCheckboxToggle('courses', c)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      formData.courses.includes(c)
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white border-border-color text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text-secondary mb-2">Eligible Batches</label>
              <div className="flex flex-wrap gap-2">
                {batchesList.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleCheckboxToggle('batches', b)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      formData.batches.includes(b)
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white border-border-color text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Selection Process & Assessment Rounds */}
      <Card
        title="Selection Process & Assessment Stages"
        subtitle="Rounds sequence (Enter one round per line)"
      >
        <div className="text-xs">
          <textarea
            name="selectionProcess"
            rows="4"
            value={formData.selectionProcess}
            onChange={handleChange}
            placeholder="Online Coding Assessment (DSA & Algorithmic Problem Solving)&#10;Technical Round 1 (Data Structures & System Design)&#10;Managerial / HR Round"
            className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed font-mono"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEdit && initialData?.id ? ROUTES.DRIVES.DETAILS(initialData.id) : ROUTES.DRIVES.ROOT)}
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
          {isEdit ? 'Save Changes' : 'Publish Placement Drive'}
        </Button>
      </div>
    </form>
  );
};

export default DriveForm;
