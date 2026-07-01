import type { PrismaClient } from "@prisma/client";

const PRODUCTION_DB_PATH = "/tmp/carmatch.db";

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "priceLakh" REAL NOT NULL,
    "mileageKmpl" REAL NOT NULL,
    "safetyRating" INTEGER NOT NULL,
    "seating" INTEGER NOT NULL,
    "transmission" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "reviewScore" REAL NOT NULL,
    "imageEmoji" TEXT NOT NULL DEFAULT 'CAR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Shortlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "ShortlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortlistId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShortlistItem_shortlistId_fkey" FOREIGN KEY ("shortlistId") REFERENCES "Shortlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShortlistItem_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Shortlist_sessionId_key" ON "Shortlist"("sessionId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ShortlistItem_shortlistId_carId_key" ON "ShortlistItem"("shortlistId", "carId")`,
];

let schemaReady = false;

function isVercelDeployment(): boolean {
  return process.env.VERCEL === "1";
}

function usesRelativeSqlitePath(url: string): boolean {
  return url.startsWith("file:./") || url.startsWith("file:../");
}

export function getDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL;

  if (configured && !usesRelativeSqlitePath(configured)) {
    return configured;
  }

  if (isVercelDeployment()) {
    return `file:${PRODUCTION_DB_PATH}`;
  }

  return configured ?? "file:./dev.db";
}

export async function ensureDatabaseReady(prisma: PrismaClient): Promise<void> {
  if (schemaReady || !getDatabaseUrl().includes("/tmp/")) {
    schemaReady = true;
    return;
  }

  for (const statement of SCHEMA_STATEMENTS) {
    await prisma.$executeRawUnsafe(statement);
  }

  schemaReady = true;
}
