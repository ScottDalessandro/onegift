/*
  Warnings:

  - You are about to drop the column `description` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `eventDate` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `List` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "eventId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planType" TEXT NOT NULL DEFAULT 'free',
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "List_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "List_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_List" ("createdAt", "id", "ownerId", "planType", "status", "title", "updatedAt") SELECT "createdAt", "id", "ownerId", "planType", "status", "title", "updatedAt" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE INDEX "List_ownerId_idx" ON "List"("ownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
