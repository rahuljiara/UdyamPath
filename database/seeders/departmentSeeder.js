export const seedDepartments = async ({ Department, departmentsData, userMap }) => {
  console.log('\n[2/9] Seeding Departments...');
  const deptDocsToInsert = departmentsData.map((d) => ({
    name: d.name,
    code: d.code,
    hod: d.hod,
    hodUser: userMap[d.hodEmail]?._id,
    description: d.description,
    studentCount: d.studentCount,
    placedStudents: d.placedStudents,
    averagePackage: d.averagePackage,
    highestPackage: d.highestPackage,
    isActive: true
  }));

  const createdDepartments = await Department.insertMany(deptDocsToInsert);
  const deptMap = {};
  createdDepartments.forEach((d) => {
    deptMap[d.code] = d;
    deptMap[d.name] = d;
  });

  console.log(`[Departments] ✅ Created ${createdDepartments.length} departments.`);
  return { createdDepartments, deptMap };
};
