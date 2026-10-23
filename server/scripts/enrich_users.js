import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Student from '../models/Student.js';

async function run() {
  await connectDB();
  console.log('Enriching users with department, deptCode, studentId, cgpa, and company...');

  // 1. HODs
  const hodUpdates = [
    { email: 'hod.cse@college.edu.in', department: 'Computer Science & Engineering', deptCode: 'CSE' },
    { email: 'hod.it@college.edu.in', department: 'Information Technology', deptCode: 'IT' },
    { email: 'hod.ece@college.edu.in', department: 'Electronics & Communication', deptCode: 'ECE' },
    { email: 'hod.eee@college.edu.in', department: 'Electrical & Electronics', deptCode: 'EEE' },
    { email: 'hod.mech@college.edu.in', department: 'Mechanical Engineering', deptCode: 'MECH' }
  ];

  for (const h of hodUpdates) {
    const res = await User.findOneAndUpdate(
      { email: h.email },
      { $set: { department: h.department, deptCode: h.deptCode, role: 'HOD' } },
      { new: true }
    );
    if (res) console.log(`Updated HOD: ${res.name} (${res.email}) -> ${res.deptCode}`);
  }

  // 2. Recruiters
  const recruiterUpdates = [
    { email: 'recruiter@microsoft.com', company: 'Microsoft India' },
    { email: 'recruiter@google.com', company: 'Google India' },
    { email: 'recruiter@tcs.com', company: 'Tata Consultancy Services (TCS)' },
    { email: 'recruiter@infosys.com', company: 'Infosys' }
  ];

  for (const r of recruiterUpdates) {
    const res = await User.findOneAndUpdate(
      { email: r.email },
      { $set: { company: r.company, role: 'RECRUITER' } },
      { new: true }
    );
    if (res) console.log(`Updated Recruiter: ${res.name} (${res.email}) -> ${res.company}`);
  }

  // 3. Students
  const students = await Student.find({});
  console.log(`Found ${students.length} students to synchronize...`);

  for (const s of students) {
    const updateData = {
      department: s.department,
      deptCode: s.deptCode,
      studentId: s.studentId,
      cgpa: s.cgpa,
      role: 'STUDENT'
    };

    let userDoc = null;
    if (s.user) {
      userDoc = await User.findByIdAndUpdate(s.user, { $set: updateData }, { new: true });
    }
    if (!userDoc && s.email) {
      userDoc = await User.findOneAndUpdate({ email: s.email }, { $set: updateData }, { new: true });
    }
    if (userDoc && !s.user) {
      s.user = userDoc._id;
      await s.save();
    }
  }

  console.log('User enrichment complete!');
  process.exit(0);
}

run().catch(console.error);
