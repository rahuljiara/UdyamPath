import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';

import User from '../models/User.js';
import Department from '../models/Department.js';
import Company from '../models/Company.js';
import Student from '../models/Student.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import Placement from '../models/Placement.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../client/src/data');
const readJSON = (filename) => JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));

const initialDepartments = readJSON('departments.json');
const initialCompanies = readJSON('companies.json');
const initialStudents = readJSON('students.json');
const initialDrives = readJSON('placementDrives.json');
const initialApplications = readJSON('applications.json');
const initialInterviews = readJSON('interviews.json');
const initialOffers = readJSON('offers.json');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Department.deleteMany(),
      Company.deleteMany(),
      Student.deleteMany(),
      PlacementDrive.deleteMany(),
      Application.deleteMany(),
      Interview.deleteMany(),
      Offer.deleteMany(),
      Placement.deleteMany()
    ]);

    console.log('[Seed] 1. Creating Seed Users...');
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('password123', salt);

    const usersToCreate = [
      {
        name: 'Dr. Rahul Deshmukh',
        email: 'tpo.director@college.edu.in',
        password: demoPassword,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Prof. Ramesh K. Verma',
        email: 'admin@udyampath.com',
        password: demoPassword,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Dr. Arisudan Sharma',
        email: 'hod.cse@college.edu.in',
        password: demoPassword,
        role: 'HOD',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma21@college.edu.in',
        password: demoPassword,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Ananya Deshpande',
        email: 'ananya.d21@college.edu.in',
        password: demoPassword,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Devansh Verma',
        email: 'devansh.v21@college.edu.in',
        password: demoPassword,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=60',
        isActive: true
      },
      {
        name: 'Sneha Kulkarni',
        email: 'recruiter@microsoft.com',
        password: demoPassword,
        role: 'RECRUITER',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=60',
        isActive: true
      }
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    console.log('[Seed] 2. Inserting Departments...');
    const deptDocs = initialDepartments.map((d) => ({
      name: d.name,
      code: d.code,
      hod: d.hod,
      studentCount: d.totalStudents,
      placedStudents: d.placedStudents,
      averagePackage: d.averagePackage,
      highestPackage: d.highestPackage,
      isActive: true
    }));
    const createdDepts = await Department.insertMany(deptDocs);
    const deptMap = {};
    createdDepts.forEach((d) => {
      deptMap[d.code] = d;
      deptMap[d.name] = d;
    });

    console.log('[Seed] 3. Inserting Companies...');
    const compDocs = initialCompanies.map((c) => ({
      companyId: c.companyId,
      name: c.name,
      logo: c.logo,
      industry: c.industry,
      type: c.type,
      website: c.website,
      location: c.location,
      city: c.city,
      state: c.state,
      description: c.description,
      employeeCount: c.employeeCount,
      contactPerson: c.contactPerson,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      status: c.status,
      tier: c.tier,
      averagePackage: c.averagePackage,
      activeDrivesCount: c.activeDrivesCount,
      totalHires: c.totalHires
    }));
    const createdCompanies = await Company.insertMany(compDocs);
    const companyMap = {};
    createdCompanies.forEach((c) => {
      companyMap[c.companyId] = c;
      companyMap[c.name] = c;
    });

    console.log('[Seed] 4. Inserting Students...');
    const studentDocs = initialStudents.map((s) => ({
      studentId: s.studentId,
      user: userMap[s.email]?._id || undefined,
      firstName: s.firstName,
      lastName: s.lastName,
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      dateOfBirth: s.dateOfBirth,
      gender: s.gender,
      department: s.department,
      deptCode: s.deptCode,
      departmentRef: deptMap[s.deptCode]?._id || undefined,
      course: s.course,
      batch: s.batch,
      semester: s.semester,
      cgpa: s.cgpa,
      backlogs: s.backlogs,
      skills: s.skills,
      programmingLanguages: s.programmingLanguages,
      resumeUrl: s.resumeUrl,
      github: s.github,
      linkedin: s.linkedin,
      portfolio: s.portfolio,
      placementStatus: s.placementStatus,
      placedCompany: s.placedCompany,
      placedPackage: s.placedPackage,
      isEligible: s.isEligible,
      avatar: s.avatar
    }));
    const createdStudents = await Student.insertMany(studentDocs);
    const studentMap = {};
    createdStudents.forEach((s) => {
      studentMap[s.studentId] = s;
      studentMap[s.email] = s;
    });

    console.log('[Seed] 5. Inserting Placement Drives...');
    const driveDocs = initialDrives.map((d) => {
      const comp = companyMap[d.companyName] || createdCompanies[0];
      return {
        driveId: d.driveId,
        company: comp?._id,
        companyName: d.companyName,
        companyLogo: d.companyLogo,
        title: d.title,
        description: d.description,
        jobType: d.jobType,
        location: d.location,
        salaryBreakup: d.salaryBreakup,
        ctc: d.ctc,
        openings: d.openings,
        applicationsCount: d.applicationsCount,
        shortlistedCount: d.shortlistedCount,
        applicationDeadline: new Date(d.applicationDeadline),
        driveDate: d.driveDate,
        eligibility: d.eligibility,
        selectionProcess: d.selectionProcess,
        status: d.status,
        createdBy: userMap['tpo.director@college.edu.in']?._id
      };
    });
    const createdDrives = await PlacementDrive.insertMany(driveDocs);
    const driveMap = {};
    createdDrives.forEach((d) => {
      driveMap[d.driveId] = d;
    });

    console.log('[Seed] 6. Inserting Applications...');
    const applicationDocs = initialApplications.map((a, idx) => {
      // Find matching drive and student
      const drive = createdDrives.find((d) => d.companyName === a.companyName) || createdDrives[0];
      const student = createdStudents.find((s) => s.email === a.studentEmail) || createdStudents[idx % createdStudents.length];

      return {
        applicationId: a.applicationId,
        student: student._id,
        studentName: a.studentName,
        studentEmail: a.studentEmail,
        studentDepartment: a.studentDepartment,
        studentCgpa: a.studentCgpa,
        studentAvatar: a.studentAvatar,
        drive: drive._id,
        driveId: drive.driveId,
        companyName: a.companyName,
        position: a.position,
        appliedAt: new Date(a.appliedAt),
        currentStage: a.currentStage,
        status: a.status,
        notes: a.notes
      };
    });
    const createdApplications = await Application.insertMany(applicationDocs);
    const appMap = {};
    createdApplications.forEach((a) => {
      appMap[a.applicationId] = a;
    });

    console.log('[Seed] 7. Inserting Interviews...');
    const interviewDocs = initialInterviews.map((i, idx) => {
      const student = createdStudents.find((s) => s.fullName === i.studentName) || createdStudents[idx % createdStudents.length];
      const company = createdCompanies.find((c) => c.name === i.companyName) || createdCompanies[0];
      const app = createdApplications.find((a) => a.studentName === i.studentName);

      return {
        interviewId: `INT2025-${String(idx + 1).padStart(3, '0')}`,
        application: app?._id,
        company: company?._id,
        companyName: i.companyName,
        companyLogo: i.companyLogo,
        student: student?._id,
        studentName: i.studentName,
        studentDepartment: i.studentDepartment,
        studentAvatar: i.studentAvatar,
        position: i.position,
        round: i.round,
        date: i.date,
        startTime: i.startTime,
        endTime: i.endTime,
        mode: i.mode,
        meetingLink: i.meetingLink,
        location: i.location,
        interviewer: i.interviewer,
        status: i.status,
        feedback: i.feedback
      };
    });
    await Interview.insertMany(interviewDocs);

    console.log('[Seed] 8. Inserting Offers...');
    const offerDocs = initialOffers.map((o, idx) => {
      const student = createdStudents.find((s) => s.fullName === o.studentName) || createdStudents[idx % createdStudents.length];
      const company = createdCompanies.find((c) => c.name === o.companyName) || createdCompanies[0];
      const drive = createdDrives.find((d) => d.companyName === o.companyName);
      const app = createdApplications.find((a) => a.studentName === o.studentName);

      return {
        offerId: o.offerId,
        student: student?._id,
        studentName: o.studentName,
        studentDepartment: o.studentDepartment,
        studentAvatar: o.studentAvatar,
        company: company?._id,
        companyName: o.companyName,
        companyLogo: o.companyLogo,
        drive: drive?._id,
        application: app?._id,
        jobTitle: o.jobTitle,
        ctc: o.ctc,
        salaryBreakup: o.salaryBreakup,
        offerDate: o.offerDate,
        joiningDate: o.joiningDate,
        offerLetterUrl: o.offerLetterUrl,
        status: o.status,
        notes: o.notes
      };
    });
    const createdOffers = await Offer.insertMany(offerDocs);

    console.log('[Seed] 9. Inserting Confirmed Placements...');
    const acceptedOffers = createdOffers.filter((o) => o.status === 'Accepted');
    const placementDocs = acceptedOffers.map((o) => {
      const match = o.ctc.match(/(\d+(\.\d+)?)/);
      const numericCtc = match ? parseFloat(match[0]) : 0;

      return {
        student: o.student,
        studentName: o.studentName,
        company: o.company,
        companyName: o.companyName,
        jobTitle: o.jobTitle,
        ctc: o.ctc,
        numericCtc,
        joiningDate: o.joiningDate,
        placementYear: '2024-2025',
        department: o.studentDepartment,
        offer: o._id,
        status: 'Confirmed'
      };
    });
    await Placement.insertMany(placementDocs);

    console.log('\n====================================================');
    console.log('🎉 UdyamPath MongoDB Seeding Completed Successfully!');
    console.log('====================================================');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Departments: ${createdDepts.length}`);
    console.log(`- Companies: ${createdCompanies.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log(`- Placement Drives: ${createdDrives.length}`);
    console.log(`- Applications: ${createdApplications.length}`);
    console.log(`- Interviews: ${interviewDocs.length}`);
    console.log(`- Offers: ${createdOffers.length}`);
    console.log(`- Placements: ${placementDocs.length}`);
    console.log('----------------------------------------------------');
    console.log('Demo Credentials (password for all: password123)');
    console.log('1. Admin:     admin@udyampath.com / tpo.director@college.edu.in');
    console.log('2. HOD:       hod.cse@college.edu.in');
    console.log('3. Student:   rahul.sharma21@college.edu.in');
    console.log('4. Recruiter: recruiter@microsoft.com');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Seeding failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedData();
