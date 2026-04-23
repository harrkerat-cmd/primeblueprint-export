import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(databaseUrl);

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = isDatabaseConfigured
  ? global.prismaGlobal ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  global.prismaGlobal = prisma;
}
