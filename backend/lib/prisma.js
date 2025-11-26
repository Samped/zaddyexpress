import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables before creating PrismaClient
dotenv.config();

const prisma = new PrismaClient();

export default prisma;


