/*
  Warnings:

  - You are about to drop the column `location` on the `Registry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Registry` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Registry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planType" TEXT NOT NULL DEFAULT 'free',
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Registry_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Registry" ("createdAt", "description", "eventDate", "eventType", "id", "planType", "status", "title", "updatedAt") SELECT "createdAt", "description", "eventDate", "eventType", "id", "planType", "status", "title", "updatedAt" FROM "Registry";
DROP TABLE "Registry";
ALTER TABLE "new_Registry" RENAME TO "Registry";
CREATE INDEX "Registry_ownerId_idx" ON "Registry"("ownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
