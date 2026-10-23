import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import User from '../models/User.js';

async function run() {
  await connectDB();
  const nonStudents = await User.find({ role: { $ne: 'STUDENT' } }, 'name email role department');
  console.log('NON-STUDENT USERS IN DB:\n', JSON.stringify(nonStudents, null, 2));

  const roleCounts = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  console.log('ROLE COUNTS:\n', JSON.stringify(roleCounts, null, 2));
  process.exit(0);
}
run().catch(console.error);
