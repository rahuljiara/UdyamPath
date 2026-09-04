export const seedPlacements = async ({ Placement, createdOffers }) => {
  console.log('\n[9/9] Generating & Seeding Confirmed Placements...');
  const placementDocsToInsert = createdOffers.map((o) => {
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

  const createdPlacements = await Placement.insertMany(placementDocsToInsert);
  console.log(`[Placements] ✅ Created ${createdPlacements.length} confirmed placements.`);
  return { createdPlacements };
};
