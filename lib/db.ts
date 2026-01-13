import { PrismaClient } from "@prisma/client";

// ============================================
// Prisma Database Client Singleton
// Prevents multiple instances in development with hot reload
// ============================================
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
