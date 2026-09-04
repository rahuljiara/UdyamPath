export const seedInterviews = async ({ Interview, createdApplications, companyMap, createdCompanies }) => {
  console.log('\n[7/9] Generating & Seeding Interviews...');
  const interviewDocsToInsert = [];
  let intCounter = 1;

  for (const app of createdApplications) {
    if (app.status === 'Selected' || app.status === 'Shortlisted') {
      const comp = companyMap[app.companyName] || createdCompanies[0];
      const isCompleted = app.status === 'Selected';

      interviewDocsToInsert.push({
        interviewId: `INT2025-${String(intCounter++).padStart(3, '0')}`,
        application: app._id,
        company: comp._id,
        companyName: app.companyName,
        companyLogo: comp.logo,
        student: app.student,
        studentName: app.studentName,
        studentDepartment: app.studentDepartment,
        studentAvatar: app.studentAvatar,
        position: app.position,
        round: isCompleted ? 'Technical Round 2 & HR' : 'Technical Round 1 (DSA & Architecture)',
        date: isCompleted ? '2025-03-05' : '2025-03-24',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        mode: 'Online',
        meetingLink: `https://meet.google.com/udy-${String(intCounter).padStart(3, '0')}-xyz`,
        location: 'Virtual Meeting Room 3',
        interviewer: comp.contactPerson || 'Senior Engineering Manager',
        status: isCompleted ? 'Completed' : 'Scheduled',
        feedback: isCompleted
          ? 'Strong technical foundation, excellent problem solving speed, clear communication.'
          : 'Candidate shortlisted for upcoming round based on OA performance.'
      });
    }
  }

  const createdInterviews = await Interview.insertMany(interviewDocsToInsert);
  console.log(`[Interviews] ✅ Created ${createdInterviews.length} interviews.`);
  return { createdInterviews };
};
