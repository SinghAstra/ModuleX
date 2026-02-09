import { PrismaClient } from "./generated/client";
export * from "./generated/client";

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

export const prisma = global.cachedPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.cachedPrisma = prisma;
