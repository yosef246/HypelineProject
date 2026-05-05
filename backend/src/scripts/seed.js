import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

const ADMIN = {
  fullName: 'Hypeline Admin',
  email: 'admin@hypeline.local',
  phone: '0501234567',
  password: 'Admin1234!',
  role: 'admin',
  status: 'active',
  city: 'Tel Aviv',
  termsAcceptedAt: new Date(),
  privacyAcceptedAt: new Date(),
};

const run = async () => {
  await connectDB();
  const exists = await User.findOne({ email: ADMIN.email });
  if (exists) {
    logger.info('Admin already exists - skipping');
  } else {
    await User.create(ADMIN);
    logger.info('✅ Admin user created');
    logger.info(`   email: ${ADMIN.email}`);
    logger.info(`   password: ${ADMIN.password}  ← CHANGE THIS IMMEDIATELY!`);
  }
  await mongoose.disconnect();
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
