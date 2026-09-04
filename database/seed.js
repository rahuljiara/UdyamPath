import { connectDB, disconnectDB, bcrypt, dataDir } from './config/connection.js';
import {
  User,
  Department,
  Company,
  Student,
  PlacementDrive,
  Application,
  Interview,
  Offer,
  Placement
} from './models/index.js';

import { staffUsersData } from './definitions/staff.js';
import { departmentsData } from './definitions/departments.js';
import { companiesData } from './definitions/companies.js';
import { placementDrivesData } from './definitions/placementDrives.js';
import { generate100Students } from './definitions/studentGenerator.js';

import { seedUsers } from './seeders/userSeeder.js';
import { seedDepartments } from './seeders/departmentSeeder.js';
import { seedCompanies } from './seeders/companySeeder.js';
import { seedStudents } from './seeders/studentSeeder.js';
import { seedPlacementDrives } from './seeders/driveSeeder.js';
import { seedApplications } from './seeders/applicationSeeder.js';
import { seedInterviews } from './seeders/interviewSeeder.js';
import { seedOffers } from './seeders/offerSeeder.js';
import { seedPlacements } from './seeders/placementSeeder.js';
import { syncAggregationsAndExport } from './seeders/syncSeeder.js';

export const seedAll = async () => {
  try {
    console.log('\n=============================================================');
    console.log('🚀 UdyamPath Modular Database Seeder');
    console.log('=============================================================');

    // 0. Connect & clean up
    await connectDB();

    console.log('\n[Purge] Clearing existing documents across all 9 collections...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Company.deleteMany({}),
      Student.deleteMany({}),
      PlacementDrive.deleteMany({}),
      Application.deleteMany({}),
      Interview.deleteMany({}),
      Offer.deleteMany({}),
      Placement.deleteMany({})
    ]);

    // Generate in-memory student profiles
    const studentsList = generate100Students();
    console.log(`[Init] Generated ${studentsList.length} student profiles.`);

    // 1. Users
    const { createdUsers, userMap } = await seedUsers({ User, bcrypt, staffUsersData, studentsList });

    // 2. Departments
    const { createdDepartments, deptMap } = await seedDepartments({ Department, departmentsData, userMap });

    // 3. Companies
    const { createdCompanies, companyMap } = await seedCompanies({ Company, companiesData });

    // 4. Students
    const { createdStudents, studentMap } = await seedStudents({ Student, studentsList, userMap, deptMap });

    // 5. Placement Drives
    const tpoUser = userMap['tpo.director@college.edu.in'] || createdUsers[0];
    const { createdDrives, driveMap } = await seedPlacementDrives({
      PlacementDrive,
      placementDrivesData,
      companyMap,
      createdCompanies,
      tpoUser
    });

    // 6. Applications
    const { createdApplications, appMap } = await seedApplications({ Application, createdStudents, createdDrives });

    // 7. Interviews
    const { createdInterviews } = await seedInterviews({
      Interview,
      createdApplications,
      companyMap,
      createdCompanies
    });

    // 8. Offers
    const { createdOffers } = await seedOffers({
      Offer,
      createdApplications,
      createdStudents,
      createdDrives,
      companyMap,
      createdCompanies
    });

    // 9. Placements
    const { createdPlacements } = await seedPlacements({ Placement, createdOffers });

    // 10. Dynamic Synchronization & JSON export
    await syncAggregationsAndExport({
      models: { PlacementDrive, Application, Department, Student, Placement, Company },
      entities: {
        createdDrives,
        createdDepartments,
        createdCompanies,
        createdStudents,
        createdApplications,
        createdInterviews,
        createdOffers,
        createdPlacements
      },
      definitions: {
        staffUsersData,
        departmentsData,
        companiesData,
        placementDrivesData
      },
      dataDir
    });

    // 11. Summary Report
    const counts = {
      users: await User.countDocuments(),
      departments: await Department.countDocuments(),
      companies: await Company.countDocuments(),
      students: await Student.countDocuments(),
      drives: await PlacementDrive.countDocuments(),
      applications: await Application.countDocuments(),
      interviews: await Interview.countDocuments(),
      offers: await Offer.countDocuments(),
      placements: await Placement.countDocuments()
    };

    console.log('\n=============================================================');
    console.log('🎉 ALL 9 MONGODB COLLECTIONS SEEDED & SYNCHRONIZED!');
    console.log('=============================================================');
    console.log(`1. Users Collection:             ${counts.users} records`);
    console.log(`2. Departments Collection:       ${counts.departments} records`);
    console.log(`3. Companies Collection:         ${counts.companies} records`);
    console.log(`4. Students Collection:          ${counts.students} records`);
    console.log(`5. Placement Drives Collection:  ${counts.drives} records`);
    console.log(`6. Applications Collection:      ${counts.applications} records`);
    console.log(`7. Interviews Collection:        ${counts.interviews} records`);
    console.log(`8. Offers Collection:            ${counts.offers} records`);
    console.log(`9. Placements Collection:        ${counts.placements} records`);
    console.log('-------------------------------------------------------------');
    console.log('🔑 Default Password for ALL accounts: password123');
    console.log('   - Admin:      admin@udyampath.com');
    console.log('   - TPO:        tpo.director@college.edu.in');
    console.log('   - HOD (CSE):  hod.cse@college.edu.in');
    console.log('   - Recruiter:  recruiter@microsoft.com');
    console.log('   - Student:    rahul.sha21@college.edu.in');
    console.log('=============================================================\n');

    await disconnectDB();
    return counts;
  } catch (error) {
    console.error('[Error] Seeding failed:', error.message);
    console.error(error.stack);
    await disconnectDB();
    throw error;
  }
};

// Execute if run directly via CLI
if (process.argv[1]) {
  seedAll()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
