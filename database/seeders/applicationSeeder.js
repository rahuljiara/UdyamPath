export const seedApplications = async ({ Application, createdStudents, createdDrives }) => {
  console.log('\n[6/9] Generating & Seeding Applications...');
  const applicationDocsToInsert = [];
  let appIndexCounter = 1;

  for (const stud of createdStudents) {
    if (stud.placementStatus === 'Placed' && stud.placedCompany) {
      const matchingDrive = createdDrives.find((d) => d.companyName === stud.placedCompany) || createdDrives[0];
      applicationDocsToInsert.push({
        applicationId: `APP2025-${String(appIndexCounter++).padStart(4, '0')}`,
        student: stud._id,
        studentName: stud.fullName,
        studentEmail: stud.email,
        studentDepartment: stud.department,
        studentCgpa: stud.cgpa,
        studentAvatar: stud.avatar,
        drive: matchingDrive._id,
        driveId: matchingDrive.driveId,
        companyName: matchingDrive.companyName,
        position: matchingDrive.title,
        appliedAt: new Date('2025-02-15T10:00:00Z'),
        currentStage: 'Final Selection',
        status: 'Selected',
        notes: `Cleared all technical and leadership rounds. Recommended for offer at ${stud.placedPackage}.`
      });
    } else if (stud.placementStatus === 'Shortlisted') {
      const matchingDrive = createdDrives.find((d) => d.eligibility.departments.includes(stud.department)) || createdDrives[0];
      applicationDocsToInsert.push({
        applicationId: `APP2025-${String(appIndexCounter++).padStart(4, '0')}`,
        student: stud._id,
        studentName: stud.fullName,
        studentEmail: stud.email,
        studentDepartment: stud.department,
        studentCgpa: stud.cgpa,
        studentAvatar: stud.avatar,
        drive: matchingDrive._id,
        driveId: matchingDrive.driveId,
        companyName: matchingDrive.companyName,
        position: matchingDrive.title,
        appliedAt: new Date('2025-02-20T11:30:00Z'),
        currentStage: 'Technical Interview',
        status: 'Shortlisted',
        notes: 'Qualified online assessment round with top percentile score.'
      });
    } else if (stud.placementStatus === 'Applied' || stud.placementStatus === 'In Process') {
      const eligibleDrives = createdDrives.filter((d) => d.status === 'Open' && d.eligibility.departments.includes(stud.department));
      const chosenDrive = eligibleDrives.length > 0 ? eligibleDrives[stud.studentId.charCodeAt(stud.studentId.length - 1) % eligibleDrives.length] : createdDrives[0];
      applicationDocsToInsert.push({
        applicationId: `APP2025-${String(appIndexCounter++).padStart(4, '0')}`,
        student: stud._id,
        studentName: stud.fullName,
        studentEmail: stud.email,
        studentDepartment: stud.department,
        studentCgpa: stud.cgpa,
        studentAvatar: stud.avatar,
        drive: chosenDrive._id,
        driveId: chosenDrive.driveId,
        companyName: chosenDrive.companyName,
        position: chosenDrive.title,
        appliedAt: new Date('2025-02-28T09:15:00Z'),
        currentStage: stud.placementStatus === 'In Process' ? 'Technical Test' : 'Application',
        status: 'Applied',
        notes: 'Application submitted and profile under review by recruitment team.'
      });
    }
  }

  const createdApplications = await Application.insertMany(applicationDocsToInsert);
  const appMap = {};
  createdApplications.forEach((a) => {
    appMap[`${a.student.toString()}_${a.drive.toString()}`] = a;
  });

  console.log(`[Applications] ✅ Created ${createdApplications.length} applications.`);
  return { createdApplications, appMap };
};
