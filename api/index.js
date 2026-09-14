import 'dotenv/config';
import mongoose from 'mongoose';
import app from '../backend/server.js';
import { connectDatabase } from '../backend/config/database.js';

export default async function handler(req, res) {
  // Connect (or reuse) MongoDB connection on every cold start
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDatabase();
    } catch (dbError) {
      console.error('[Vercel] DB connection failed:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Check MONGODB_URI in Vercel Environment Variables and ensure MongoDB Atlas allows 0.0.0.0/0.',
        detail: dbError.message,
      });
    }
  }

  return app(req, res);
}
