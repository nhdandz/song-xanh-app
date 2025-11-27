<<<<<<< HEAD
// File: src/lib/prisma.js
import { PrismaClient } from "@prisma/client";

// singleton pattern to avoid multiple PrismaClients during hot reloads
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["error", "warn"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prisma;
}

// export both default and named to be safe
export default prisma;
export { prisma };
=======
import { PrismaClient } from '@prisma/client';

// Tạo một instance của PrismaClient
const globalForPrisma = global;

// Tránh tạo nhiều kết nối trong chế độ development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
>>>>>>> c9a6028 (add database)
