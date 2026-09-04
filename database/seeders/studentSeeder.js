export const seedStudents = async ({ Student, studentsList, userMap, deptMap }) => {
  console.log('\n[4/9] Seeding Students...');
  const studentDocsToInsert = studentsList.map((s) => ({
    studentId: s.studentId,
    user: userMap[s.email.toLowerCase()]?._id,
    firstName: s.firstName,
    lastName: s.lastName,
    fullName: s.fullName,
    email: s.email.toLowerCase(),
    phone: s.phone,
    dateOfBirth: s.dateOfBirth,
    gender: s.gender,
    department: s.department,
    deptCode: s.deptCode,
    departmentRef: deptMap[s.deptCode]?._id,
    course: s.course || 'B.Tech',
    batch: s.batch || '2021-2025',
    semester: s.semester || 8,
    cgpa: s.cgpa,
    backlogs: s.backlogs || 0,
    skills: s.skills || [],
    programmingLanguages: s.programmingLanguages || [],
    resumeUrl: s.resumeUrl || '',
    github: s.github || '',
    linkedin: s.linkedin || '',
    portfolio: s.portfolio || '',
    placementStatus: s.placementStatus || 'Seeking',
    placedCompany: s.placedCompany || null,
    placedPackage: s.placedPackage || null,
    isEligible: s.isEligible !== undefined ? s.isEligible : true,
    avatar: s.avatar || ''
  }));

  const createdStudents = await Student.insertMany(studentDocsToInsert);
  const studentMap = {};
  createdStudents.forEach((s) => {
    studentMap[s.studentId] = s;
    studentMap[s.email] = s;
  });

  console.log(`[Students] ✅ Created ${createdStudents.length} students.`);
  return { createdStudents, studentMap };
};
