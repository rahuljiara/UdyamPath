import React, { useState, useEffect } from 'react';
import { Save, Calendar, Clock, Video, MapPin, User, Building2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { studentService } from '../../services/studentService';
import { companyService } from '../../services/companyService';

const roundTypes = [
  'Online Coding Assessment',
  'Technical Interview 1',
  'Technical Round 2 (System Design)',
  'Case Study & GD',
  'HR / Managerial Round',
  'Founder / AA Round'
];

const ScheduleInterviewModal = ({
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
    position: '',
    round: 'Technical Interview 1',
    date: new Date().toISOString().slice(0, 10),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    mode: 'Online (MS Teams)',
    meetingLink: '',
    location: '',
    interviewer: '',
    status: 'Scheduled',
    feedback: ''
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
            position: 'Software Engineer'
          }));
        }
      } catch (err) {
        console.error('Error fetching interview options:', err);
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
        position: initialData.position || '',
        round: initialData.round || 'Technical Interview 1',
        date: initialData.date || new Date().toISOString().slice(0, 10),
        startTime: initialData.startTime || '10:00 AM',
        endTime: initialData.endTime || '11:00 AM',
        mode: initialData.mode || 'Online (MS Teams)',
        meetingLink: initialData.meetingLink || '',
        location: initialData.location || '',
        interviewer: initialData.interviewer || '',
        status: initialData.status || 'Scheduled',
        feedback: initialData.feedback || ''
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
        companyLogo: found.logo
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentName) errs.studentName = 'Student is required';
    if (!formData.companyName) errs.companyName = 'Company is required';
    if (!formData.position) errs.position = 'Position is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.interviewer) errs.interviewer = 'Interviewer name is required';
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
      title={isEdit ? 'Edit Interview Slot' : 'Schedule Assessment Interview'}
      subtitle={isEdit ? 'Update time, interviewer, or feedback' : 'Configure round slot and invite candidates'}
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
            {isEdit ? 'Save Changes' : 'Confirm & Schedule'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Candidate / Student <span className="text-rose-500">*</span>
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

          {/* Position */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Job Position / Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Development Engineer - 1"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.position ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.position && <p className="text-rose-500 text-[11px] mt-1">{errors.position}</p>}
          </div>

          {/* Round */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Round Designation</label>
            <select
              name="round"
              value={formData.round}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {roundTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Interview Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-text-secondary mb-1">Start Time</label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="10:00 AM"
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-medium text-text-secondary mb-1">End Time</label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="11:00 AM"
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Interview Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Online (MS Teams)">Online (MS Teams)</option>
              <option value="Online (Google Meet)">Online (Google Meet)</option>
              <option value="Campus (Offline)">Campus (Offline / Placement Cell)</option>
            </select>
          </div>

          {/* Interviewer */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Interviewer Panel / Lead <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleChange}
              placeholder="e.g. Pranav Saxena (Principal Architect)"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.interviewer ? 'border-rose-400 focus:border-rose-500' : 'border-border-color focus:border-primary'
              }`}
            />
            {errors.interviewer && <p className="text-rose-500 text-[11px] mt-1">{errors.interviewer}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Slot Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Meeting Link or Venue</label>
            <input
              type="text"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://teams.microsoft.com/... or Room 302"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Feedback */}
          <div className="md:col-span-2">
            <label className="block font-medium text-text-secondary mb-1">
              Evaluator Feedback / Assessment Notes (Optional)
            </label>
            <textarea
              rows="2"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Comments on problem-solving, behavioral fit, or recommendations..."
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInterviewModal;
