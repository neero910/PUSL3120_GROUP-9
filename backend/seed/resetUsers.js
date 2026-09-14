/**
 * Reset admin/demo users with fresh password hashes.
 * Run with: node seed/resetUsers.js
 */
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const users = [
  { name: 'Admin User',        email: 'admin@hotel.com',        role: 'Administrator',    password: 'password123' },
  { name: 'Manager User',      email: 'manager@hotel.com',      role: 'Manager',          password: 'password123' },
  { name: 'Receptionist User', email: 'receptionist@hotel.com', role: 'Receptionist',     password: 'password123' },
  { name: 'Restaurant Staff',  email: 'restaurant@hotel.com',   role: 'Restaurant Staff', password: 'password123' },
];

await connectDatabase();

for (const u of users) {
  const hash = await bcrypt.hash(u.password, 10);
  // Delete existing then insert fresh so the hash is guaranteed correct
  await User.deleteOne({ email: u.email });
  await User.create({ name: u.name, email: u.email, role: u.role, password: hash, isActive: true, status: 'Active' });
  console.log(`✅ Reset user: ${u.email}`);
}

console.log('\nAll demo users reset with password: password123');
await disconnectDatabase();
