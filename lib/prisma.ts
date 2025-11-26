import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const hasValidDatabaseUrl = Boolean(
  process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.startsWith("postgres://") ||
      process.env.DATABASE_URL.startsWith("postgresql://"))
);

if (!hasValidDatabaseUrl) {
  console.warn(
    "[Prisma] DATABASE_URL tidak valid atau belum diatur. Aplikasi akan menggunakan data fallback."
  );
}

export const prisma = hasValidDatabaseUrl
  ? globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    })
  : undefined;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
