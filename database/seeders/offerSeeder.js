export const seedOffers = async ({ Offer, createdApplications, createdStudents, createdDrives, companyMap, createdCompanies }) => {
  console.log('\n[8/9] Generating & Seeding Offers...');
  const offerDocsToInsert = [];
  let offCounter = 1;

  for (const app of createdApplications) {
    if (app.status === 'Selected') {
      const comp = companyMap[app.companyName] || createdCompanies[0];
      const stud = createdStudents.find((s) => s._id.equals(app.student));
      const drive = createdDrives.find((d) => d._id.equals(app.drive));
      const ctcPackage = stud?.placedPackage || drive?.ctc || '12.0 LPA';

      offerDocsToInsert.push({
        offerId: `OFF2025-${String(offCounter++).padStart(3, '0')}`,
        student: app.student,
        studentName: app.studentName,
        studentDepartment: app.studentDepartment,
        studentAvatar: app.studentAvatar,
        company: comp._id,
        companyName: comp.name,
        companyLogo: comp.logo,
        drive: drive?._id,
        application: app._id,
        jobTitle: app.position,
        ctc: ctcPackage,
        salaryBreakup: drive?.salaryBreakup || `Gross Base + Allowances: ${ctcPackage}`,
        offerDate: '2025-03-08',
        joiningDate: '2025-07-15',
        offerLetterUrl: `https://example.com/offers/${stud?.studentId || 'OFF'}_OfferLetter.pdf`,
        status: 'Accepted',
        notes: 'Candidate accepted offer. Joining date confirmed for July 2025.'
      });
    }
  }

  const createdOffers = await Offer.insertMany(offerDocsToInsert);
  console.log(`[Offers] ✅ Created ${createdOffers.length} offers.`);
  return { createdOffers };
};
