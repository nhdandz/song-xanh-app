import { PrismaClient } from '@prisma/client';

// Tạo một instance của PrismaClient
const globalForPrisma = global;

// Tránh tạo nhiều kết nối trong chế độ development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;