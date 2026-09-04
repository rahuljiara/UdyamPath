export const seedCompanies = async ({ Company, companiesData }) => {
  console.log('\n[3/9] Seeding Companies...');
  const createdCompanies = await Company.insertMany(companiesData);
  const companyMap = {};
  createdCompanies.forEach((c) => {
    companyMap[c.companyId] = c;
    companyMap[c.name] = c;
  });

  console.log(`[Companies] ✅ Created ${createdCompanies.length} companies.`);
  return { createdCompanies, companyMap };
};
