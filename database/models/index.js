import { mongoose } from '../config/connection.js';

export const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'STUDENT', uppercase: true },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true }));

export const Department = mongoose.models.Department || mongoose.model('Department', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  hod: { type: String, default: '' },
  hodUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '' },
  studentCount: { type: Number, default: 0 },
  placedStudents: { type: Number, default: 0 },
  averagePackage: { type: String, default: '0.0 LPA' },
  highestPackage: { type: String, default: '0.0 LPA' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));

export const Company = mongoose.models.Company || mongoose.model('Company', new mongoose.Schema({
  companyId: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  industry: { type: String, default: 'Technology & IT Services' },
  type: { type: String, default: 'Product / MNC' },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  description: { type: String, default: '' },
  employeeCount: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  tier: { type: String, default: 'Tier 1' },
  averagePackage: { type: String, default: '0.0 LPA' },
  activeDrivesCount: { type: Number, default: 0 },
  totalHires: { type: Number, default: 0 }
}, { timestamps: true }));

export const Student = mongoose.models.Student || mongoose.model('Student', new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, default: 'Male' },
  department: { type: String, required: true },
  deptCode: { type: String, default: '' },
  departmentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  course: { type: String, default: 'B.Tech' },
  batch: { type: String, default: '2021-2025' },
  semester: { type: Number, default: 8 },
  cgpa: { type: Number, required: true },
  backlogs: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  programmingLanguages: { type: [String], default: [] },
  resumeUrl: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  placementStatus: { type: String, default: 'Seeking' },
  placedCompany: { type: String, default: null },
  placedPackage: { type: String, default: null },
  isEligible: { type: Boolean, default: true },
  avatar: { type: String, default: '' }
}, { timestamps: true }));

export const PlacementDrive = mongoose.models.PlacementDrive || mongoose.model('PlacementDrive', new mongoose.Schema({
  driveId: { type: String, required: true, unique: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  jobType: { type: String, default: 'Full-Time' },
  location: { type: String, default: '' },
  salary: { type: String, default: '' },
  salaryBreakup: { type: String, default: '' },
  ctc: { type: String, required: true },
  openings: { type: Number, default: 1 },
  applicationsCount: { type: Number, default: 0 },
  shortlistedCount: { type: Number, default: 0 },
  applicationDeadline: { type: Date, required: true },
  driveDate: { type: String, default: '' },
  eligibility: {
    minCgpa: { type: Number, default: 6.0 },
    maxBacklogs: { type: Number, default: 0 },
    departments: { type: [String], default: [] },
    courses: { type: [String], default: ['B.Tech'] },
    batches: { type: [String], default: ['2021-2025'] },
    requiredSkills: { type: [String], default: [] }
  },
  selectionProcess: { type: [String], default: [] },
  status: { type: String, default: 'Open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));

export const Application = mongoose.models.Application || mongoose.model('Application', new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, default: '' },
  studentEmail: { type: String, default: '' },
  studentDepartment: { type: String, default: '' },
  studentCgpa: { type: Number, default: 0 },
  studentAvatar: { type: String, default: '' },
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive', required: true },
  driveId: { type: String, default: '' },
  companyName: { type: String, default: '' },
  position: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
  currentStage: { type: String, default: 'Application' },
  status: { type: String, default: 'Applied' },
  notes: { type: String, default: '' },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true }));

export const Interview = mongoose.models.Interview || mongoose.model('Interview', new mongoose.Schema({
  interviewId: { type: String, default: '' },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  studentDepartment: { type: String, default: '' },
  studentAvatar: { type: String, default: '' },
  position: { type: String, default: '' },
  round: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, default: '10:00 AM' },
  endTime: { type: String, default: '11:00 AM' },
  mode: { type: String, default: 'Online' },
  meetingLink: { type: String, default: '' },
  location: { type: String, default: '' },
  interviewer: { type: String, default: '' },
  status: { type: String, default: 'Scheduled' },
  feedback: { type: String, default: '' }
}, { timestamps: true }));

export const Offer = mongoose.models.Offer || mongoose.model('Offer', new mongoose.Schema({
  offerId: { type: String, default: '' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  studentDepartment: { type: String, default: '' },
  studentAvatar: { type: String, default: '' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive' },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  jobTitle: { type: String, required: true },
  ctc: { type: String, required: true },
  salaryBreakup: { type: String, default: '' },
  offerDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  joiningDate: { type: String, default: '' },
  offerLetterUrl: { type: String, default: '' },
  status: { type: String, default: 'Offered' },
  notes: { type: String, default: '' }
}, { timestamps: true }));

export const Placement = mongoose.models.Placement || mongoose.model('Placement', new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, default: '' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  ctc: { type: String, required: true },
  numericCtc: { type: Number, default: 0 },
  joiningDate: { type: String, default: '' },
  placementYear: { type: String, default: '2024-2025' },
  department: { type: String, default: '' },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true }));
