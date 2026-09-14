import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  // Reuse existing connection on serverless (Vercel) warm invocations
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error.message));
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}