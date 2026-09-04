import fs from 'fs';
import path from 'path';

export const syncAggregationsAndExport = async ({
  models: { PlacementDrive, Application, Department, Student, Placement, Company },
  entities: { createdDrives, createdDepartments, createdCompanies, createdStudents, createdApplications, createdInterviews, createdOffers, createdPlacements },
  definitions: { staffUsersData, departmentsData, companiesData, placementDrivesData },
  dataDir
}) => {
  console.log('\n[Sync] Performing Dynamic Aggregations & Statistics Synchronization...');

  // A) Sync Drive application & shortlisted counts
  for (const drive of createdDrives) {
    const appCount = await Application.countDocuments({ drive: drive._id });
    const shortCount = await Application.countDocuments({
      drive: drive._id,
      status: { $in: ['Shortlisted', 'Selected'] }
    });
    await PlacementDrive.findByIdAndUpdate(drive._id, {
      applicationsCount: appCount,
      shortlistedCount: shortCount
    });
  }

  // B) Sync Department stats based on real students & placements
  for (const dept of createdDepartments) {
    const studCount = await Student.countDocuments({ department: dept.name });
    const placedCount = await Placement.countDocuments({ department: dept.name });
    const deptPlacements = await Placement.find({ department: dept.name });

    let avg = 0;
    let highest = 0;
    if (deptPlacements.length > 0) {
      const sum = deptPlacements.reduce((acc, curr) => acc + curr.numericCtc, 0);
      avg = (sum / deptPlacements.length).toFixed(1);
      highest = Math.max(...deptPlacements.map((p) => p.numericCtc)).toFixed(1);
    }

    await Department.findByIdAndUpdate(dept._id, {
      studentCount: studCount,
      placedStudents: placedCount,
      averagePackage: `${avg} LPA`,
      highestPackage: `${highest} LPA`
    });
  }

  // C) Sync Company stats based on real hires & drives
  for (const comp of createdCompanies) {
    const activeDrives = await PlacementDrive.countDocuments({ company: comp._id, status: { $in: ['Open', 'In Progress'] } });
    const totalHiresCount = await Placement.countDocuments({ company: comp._id });
    const companyPlacements = await Placement.find({ company: comp._id });

    let avg = comp.averagePackage;
    if (companyPlacements.length > 0) {
      const sum = companyPlacements.reduce((acc, curr) => acc + curr.numericCtc, 0);
      avg = `${(sum / companyPlacements.length).toFixed(1)} LPA`;
    }

    await Company.findByIdAndUpdate(comp._id, {
      activeDrivesCount: activeDrives,
      totalHires: totalHiresCount > 0 ? totalHiresCount : comp.totalHires,
      averagePackage: avg
    });
  }

  // D) Export Clean Data JSONs into database/data/
  if (dataDir) {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    console.log('\n[Export] Writing structured JSON backups to database/data/ ...');
    fs.writeFileSync(path.join(dataDir, 'staff_users.json'), JSON.stringify(staffUsersData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'departments.json'), JSON.stringify(departmentsData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'companies.json'), JSON.stringify(companiesData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'students.json'), JSON.stringify(createdStudents, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'placement_drives.json'), JSON.stringify(placementDrivesData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'applications.json'), JSON.stringify(createdApplications, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'interviews.json'), JSON.stringify(createdInterviews, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'offers.json'), JSON.stringify(createdOffers, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'placements.json'), JSON.stringify(createdPlacements, null, 2), 'utf-8');
  }

  console.log('[Sync] ✅ Aggregations and file exports synchronized successfully.');
};
