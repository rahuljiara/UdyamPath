export const seedPlacementDrives = async ({ PlacementDrive, placementDrivesData, companyMap, createdCompanies, tpoUser }) => {
  console.log('\n[5/9] Seeding Placement Drives...');
  const driveDocsToInsert = placementDrivesData.map((d) => {
    const comp = companyMap[d.companyName] || createdCompanies[0];
    return {
      driveId: d.driveId,
      company: comp._id,
      companyName: d.companyName,
      companyLogo: comp.logo || d.companyLogo,
      title: d.title,
      description: d.description,
      jobType: d.jobType,
      location: d.location,
      salaryBreakup: d.salaryBreakup,
      ctc: d.ctc,
      openings: d.openings,
      applicationsCount: 0,
      shortlistedCount: 0,
      applicationDeadline: new Date(d.applicationDeadline),
      driveDate: d.driveDate,
      eligibility: d.eligibility,
      selectionProcess: d.selectionProcess,
      status: d.status,
      createdBy: tpoUser._id
    };
  });

  const createdDrives = await PlacementDrive.insertMany(driveDocsToInsert);
  const driveMap = {};
  createdDrives.forEach((d) => {
    driveMap[d.driveId] = d;
  });

  console.log(`[Drives] ✅ Created ${createdDrives.length} placement drives.`);
  return { createdDrives, driveMap };
};
