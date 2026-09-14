import app from '../backend/server.js';
import { connectDatabase } from '../backend/config/database.js';

let isDbConnected = false;

export default async function handler(req, res) {
  // Ensure database connection is established
  if (!isDbConnected) {
    try {
      await connectDatabase();
      isDbConnected = true;
    } catch (dbError) {
      console.error('Database connection error in Vercel function:', dbError.message);
      // Allow health check to succeed even if DB is reconnecting
      if (req.url === '/api/health' || req.url === '/health') {
        return app(req, res);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to connect to database. Ensure MONGODB_URI is set in Vercel Environment Variables and MongoDB Atlas IP access allows 0.0.0.0/0.',
        error: dbError.message
      });
    }
  }

  return app(req, res);
}
