import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set in environment variables');
      process.exit(1);
    }

    if (process.env.DATABASE_URL.includes('<db_password>')) {
      console.error('DATABASE_URL still contains <db_password> placeholder');
      console.error('Please update backend/.env with your actual MongoDB password');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\nAuthentication failed. Please check:');
      console.error('1. Your MongoDB password in backend/.env');
      console.error('2. If password has special characters, URL-encode them');
      console.error('3. Your IP address is whitelisted in MongoDB Atlas');
    }
  }
};

export default connectDB;

