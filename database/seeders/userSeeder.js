export const seedUsers = async ({ User, bcrypt, staffUsersData, studentsList }) => {
  console.log('\n[1/9] Seeding Users (Staff + Students)...');
  const salt = await bcrypt.genSalt(10);
  const demoPasswordHash = await bcrypt.hash('password123', salt);

  const allUsersToInsert = [
    ...staffUsersData.map((u) => ({
      name: u.name,
      email: u.email.toLowerCase(),
      password: demoPasswordHash,
      role: u.role,
      avatar: u.avatar,
      isActive: true
    })),
    ...studentsList.map((s) => ({
      name: s.fullName,
      email: s.email.toLowerCase(),
      password: demoPasswordHash,
      role: 'STUDENT',
      avatar: s.avatar,
      isActive: true
    }))
  ];

  const createdUsers = await User.insertMany(allUsersToInsert);
  const userMap = {};
  createdUsers.forEach((u) => {
    userMap[u.email] = u;
  });

  console.log(`[Users] ✅ Created ${createdUsers.length} total users.`);
  return { createdUsers, userMap };
};
