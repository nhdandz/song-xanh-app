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
