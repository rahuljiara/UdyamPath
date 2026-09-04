# UdyamPath - Modular Database Engine & Master Seeder

This directory (`database/`) contains the modularized, production-ready data architecture, clean data JSON backups, and the modular master seeder for all **9 collections** of the UdyamPath Placement Management platform.

The seeder is completely **modular** and **self-contained**. When anyone clones the repository or deploys the app on a new machine, running `npm run seed` or `node database/seed.js` will automatically generate all 100 student profiles, link staff/recruiters/departments/companies/drives, and populate all collections directly into MongoDB.

---

## 📁 Modular Folder Structure

```
database/
├── config/
│   └── connection.js           # Shared MongoDB Atlas connection & dependency loader
├── models/
│   └── index.js                # DRY Mongoose schema definitions (All 9 Collections)
├── definitions/
│   ├── staff.js                # Admin, TPO Director, HODs, Recruiters
│   ├── departments.js          # 5 Engineering Departments definitions
│   ├── companies.js            # 17 Top Recruiter Company Profiles
│   ├── placementDrives.js      # 10 Placement Drives definitions
│   └── studentGenerator.js     # Built-in 100 students generator & avatar pools
├── seeders/
│   ├── userSeeder.js           # Seeds 110 Users with bcrypt hashed passwords
│   ├── departmentSeeder.js     # Seeds 5 Departments linked to HOD accounts
│   ├── companySeeder.js        # Seeds 17 Companies
│   ├── studentSeeder.js        # Seeds 100 Students linked to Users & Departments
│   ├── driveSeeder.js          # Seeds 10 Placement Drives linked to Companies & TPO
│   ├── applicationSeeder.js    # Seeds 80 Stage-Tracked Student Applications
│   ├── interviewSeeder.js      # Seeds 60 Scheduled & Completed Interviews
│   ├── offerSeeder.js          # Seeds 50 Job Offers with packages
│   ├── placementSeeder.js      # Seeds 50 Confirmed Student Placements
│   └── syncSeeder.js           # Dynamic stats aggregator & JSON backup exporter
├── data/                       # Structured JSON exports for all 9 collections
│   ├── staff_users.json
│   ├── departments.json
│   ├── companies.json
│   ├── students.json
│   ├── placement_drives.json
│   ├── applications.json
│   ├── interviews.json
│   ├── offers.json
│   └── placements.json
├── seed.js                     # Master Seeder Entrypoint (~140 lines)
├── package.json                # Module definition & seed script
└── README.md                   # Documentation
```

---

## 📊 Database Collections Overview

| # | Collection | Count | Description |
| :-: | :--- | :-: | :--- |
| **1** | `users` | **110** | 10 Staff (Admin, TPO, 5 HODs, 3 Recruiters) + 100 Student accounts |
| **2** | `departments` | **5** | CSE, IT, ECE, EEE, MECH (with dynamically calculated stats) |
| **3** | `companies` | **17** | Microsoft, Google, AWS, Zomato, Cisco, Qualcomm, TCS, etc. |
| **4** | `students` | **100** | Full profile with roll numbers, skills, CGPA, links, and avatars |
| **5** | `placementdrives` | **10** | Active, In Progress, and Completed drives |
| **6** | `applications` | **80** | Linked applications tracking stages (`Application` → `Selected`) |
| **7** | `interviews` | **60** | Technical & HR rounds with links, dates, and feedback |
| **8** | `offers` | **50** | Accepted & processed job offers |
| **9** | `placements` | **50** | Confirmed student placements with numeric CTC calculation |

---

## 🔄 DRY Architecture & Dynamic Synchronization

When `node database/seed.js` runs:
1. **Self-Contained Generation**: Generates 100 student records on-the-fly and synchronizes `data/students.json`.
2. **Referential Integrity**: Cross-references ObjectIds between `users`, `departments`, `companies`, `students`, `placementdrives`, `applications`, `interviews`, `offers`, and `placements`.
3. **Dynamic Department Aggregation**: Automatically computes `studentCount`, `placedStudents`, `averagePackage`, and `highestPackage` directly from real student and placement records.
4. **Dynamic Company Metrics**: Computes `activeDrivesCount`, `totalHires`, and `averagePackage` per company.
5. **Drive Metrics**: Synchronizes `applicationsCount` and `shortlistedCount`.

---

## 🚀 How to Run for New Clones & Re-seeding

Run the modular seeder anytime from the project root:

```bash
# Direct execution
node database/seed.js

# Or using the root npm script
npm run seed
```

---

## 🔑 Demo Login Credentials

> **Default Password for ALL accounts:** `password123`

| Role | Name | Email |
| :--- | :--- | :--- |
| **ADMIN** | Prof. Ramesh K. Verma | `admin@udyampath.com` |
| **TPO Director** | Dr. Rahul Deshmukh | `tpo.director@college.edu.in` |
| **HOD (CSE)** | Dr. Arisudan Sharma | `hod.cse@college.edu.in` |
| **HOD (IT)** | Dr. Meenakshi Sundaram | `hod.it@college.edu.in` |
| **HOD (ECE)** | Dr. Rajeshwar Rao | `hod.ece@college.edu.in` |
| **HOD (EEE)** | Dr. Sunita Deshmukh | `hod.eee@college.edu.in` |
| **HOD (MECH)** | Dr. Vikramaditya Sen | `hod.mech@college.edu.in` |
| **RECRUITER** | Sneha Kulkarni (Microsoft) | `recruiter@microsoft.com` |
| **RECRUITER** | Anand Nair (Google) | `recruiter@google.com` |
| **RECRUITER** | Ramanathan Iyer (TCS) | `recruiter@tcs.com` |
| **STUDENT** | Rahul Sharma | `rahul.sha21@college.edu.in` |
