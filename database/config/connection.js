import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const dotenv = require(path.resolve(__dirname, '../../server/node_modules/dotenv'));
export const mongoose = require(path.resolve(__dirname, '../../server/node_modules/mongoose'));
export const bcrypt = require(path.resolve(__dirname, '../../server/node_modules/bcryptjs'));

// Load server environment
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/udyampath';

export const connectDB = async () => {
  try {
    console.log(`[Database] Connecting to MongoDB: ${MONGO_URI.replace(/:[^:@]+@/, ':****@')}...`);
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[Database] ✅ Connected to Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};

export const dataDir = path.resolve(__dirname, '../data');

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('[Database] Disconnected gracefully from MongoDB.');
};

