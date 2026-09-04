import React, { useState, useEffect } from 'react';
import { Save, IndianRupee, FileText, Calendar, Building2, User } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { studentService } from '../../services/studentService';
import { companyService } from '../../services/companyService';

const statusOptions = ['Offered', 'Accepted', 'Declined', 'Expired'];

const RecordOfferModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentDepartment: 'CSE',
    studentAvatar: '',
    companyName: '',
    companyLogo: '',
    jobTitle: '',
    ctc: '',
    salaryBreakup: '',
    offerDate: new Date().toISOString().slice(0, 10),
    joiningDate: '2025-07-15',
    offerLetterUrl: '',
    status: 'Offered',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [studentsData, companiesData] = await Promise.all([
          studentService.getAll({ limit: 50 }),
          companyService.getAll({ limit: 50 })
        ]);
        setStudents(studentsData.students || []);
        setCompanies(companiesData.companies || []);

        if (!isEdit && !formData.studentName && studentsData.students?.length > 0) {
          const first = studentsData.students[0];
          setFormData((prev) => ({
            ...prev,
            studentId: first.id,
            studentName: first.fullName,
            studentDepartment: first.deptCode || 'CSE',
            studentAvatar: first.avatar
          }));
        }

        if (!isEdit && !formData.companyName && companiesData.companies?.length > 0) {
          const firstComp = companiesData.companies[0];
          setFormData((prev) => ({
            ...prev,
            companyName: firstComp.name,
            companyLogo: firstComp.logo,
            jobTitle: 'Software Engineer',
            ctc: firstComp.averagePackage || '12.0 LPA'
          }));
        }
      } catch (err) {
        console.error('Error fetching offer options:', err);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, isEdit]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || '',
        studentName: initialData.studentName || '',
        studentDepartment: initialData.studentDepartment || 'CSE',
        studentAvatar: initialData.studentAvatar || '',
        companyName: initialData.companyName || '',
        companyLogo: initialData.companyLogo || '',
        jobTitle: initialData.jobTitle || '',
        ctc: initialData.ctc || '',
        salaryBreakup: initialData.salaryBreakup || '',
        offerDate: initialData.offerDate || new Date().toISOString().slice(0, 10),
        joiningDate: initialData.joiningDate || '2025-07-15',
        offerLetterUrl: initialData.offerLetterUrl || '',
        status: initialData.status || 'Offered',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleStudentSelect = (e) => {
    const studId = e.target.value;
    const found = students.find((s) => s.id === studId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        studentId: found.id,
        studentName: found.fullName,
        studentDepartment: found.deptCode || 'CSE',
        studentAvatar: found.avatar
      }));
    }
  };

  const handleCompanySelect = (e) => {
    const compName = e.target.value;
    const found = companies.find((c) => c.name === compName);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        companyName: found.name,
        companyLogo: found.logo,
        ctc: prev.ctc || found.averagePackage || '12.0 LPA'
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentName) errs.studentName = 'Student is required';
    if (!formData.companyName) errs.companyName = 'Company is required';
    if (!formData.jobTitle) errs.jobTitle = 'Job title is required';
    if (!formData.ctc) errs.ctc = 'CTC package is required';
    if (!formData.offerDate) errs.offerDate = 'Offer date is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Update Placement Offer' : 'Record Placement Offer'}
      subtitle={isEdit ? 'Update joining date, status, or package' : 'Issue offer and register placement outcome'}
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSubmit}
            loading={loading}
          >
            {isEdit ? 'Save Changes' : 'Confirm & Record Offer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Select Placed Candidate <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.studentId}
              onChange={handleStudentSelect}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentId}) - {s.deptCode}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Recruiting Company <span className="text-rose-500">*</span>
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

          {/* Job Title */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Job Title / Designation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Development Engineer - 1"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.jobTitle ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.jobTitle && <p className="text-rose-500 text-[11px] mt-1">{errors.jobTitle}</p>}
          </div>

          {/* CTC */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Annual CTC Package <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              placeholder="e.g. 18.0 LPA"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.ctc ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.ctc && <p className="text-rose-500 text-[11px] mt-1">{errors.ctc}</p>}
          </div>

          {/* Offer Date */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Offer Issued Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="offerDate"
              value={formData.offerDate}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Tentative Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Offer Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Offer Letter PDF Link */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Offer Letter Document URL</label>
            <input
              type="url"
              name="offerLetterUrl"
              value={formData.offerLetterUrl}
              onChange={handleChange}
              placeholder="https://example.com/offers/letter.pdf"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Salary Breakup */}
          <div className="md:col-span-2">
            <label className="block font-medium text-text-secondary mb-1">Salary Breakup / Variable Details</label>
            <input
              type="text"
              name="salaryBreakup"
              value={formData.salaryBreakup}
              onChange={handleChange}
              placeholder="Base: 14.0 LPA | Joining Bonus: 2.0 LPA | Retention / ESOPs: 2.0 LPA"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block font-medium text-text-secondary mb-1">Internal Placement Notes</label>
            <textarea
              rows="2"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Candidate acceptance remarks, location preferences, or background checks..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default RecordOfferModal;
