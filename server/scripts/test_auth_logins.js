import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import User from '../models/User.js';
import { loginUser } from '../services/authService.js';

const testAccounts = [
  'admin@udyampath.com',
  'tpo.director@college.edu.in',
  'hod.cse@college.edu.in',
  'hod.it@college.edu.in',
  'recruiter@microsoft.com',
  'recruiter@google.com',
  'rahul.sha21@college.edu.in',
  'ananya.des51@college.edu.in'
];

async function testAll() {
  await connectDB();
  console.log('Testing authentication for all roles with password: password123\n');

  for (const email of testAccounts) {
    try {
      const res = await loginUser({ email, password: 'password123' });
      console.log(`✅ [${res.user.role}] Login SUCCESS: ${res.user.name} (${email}) - token generated (${res.token.slice(0, 15)}...)`);
    } catch (err) {
      console.error(`❌ Login FAILED: ${email} -> ${err.message}`);
    }
  }
  process.exit(0);
}

testAll().catch(console.error);
