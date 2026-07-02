import mongoose from 'mongoose';
import { config } from 'dotenv';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGO_URI

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};
