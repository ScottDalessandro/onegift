/*
  Warnings:

  - You are about to drop the `Registry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegistryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `registryId` on the `ChildProfile` table. All the data in the column will be lost.
  - You are about to drop the column `registryId` on the `Contribution` table. All the data in the column will be lost.
  - You are about to drop the column `registryId` on the `Withdrawal` table. All the data in the column will be lost.
  - Added the required column `listId` to the `ChildProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Registry_ownerId_idx";

-- DropIndex
DROP INDEX "RegistryItem_registryId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Registry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RegistryItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "List" (
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
    CONSTRAINT "List_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "url" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "listId" TEXT NOT NULL,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "interests" JSONB NOT NULL DEFAULT [],
    "dreams" JSONB NOT NULL DEFAULT [],
    "currentActivities" JSONB NOT NULL DEFAULT [],
    "upcomingActivities" JSONB NOT NULL DEFAULT [],
    "listId" TEXT NOT NULL,
    CONSTRAINT "ChildProfile_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChildProfile" ("birthdate", "createdAt", "currentActivities", "dreams", "id", "interests", "name", "upcomingActivities", "updatedAt") SELECT "birthdate", "createdAt", "currentActivities", "dreams", "id", "interests", "name", "upcomingActivities", "updatedAt" FROM "ChildProfile";
DROP TABLE "ChildProfile";
ALTER TABLE "new_ChildProfile" RENAME TO "ChildProfile";
CREATE UNIQUE INDEX "ChildProfile_listId_key" ON "ChildProfile"("listId");
CREATE TABLE "new_Contribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "listId" TEXT NOT NULL,
    CONSTRAINT "Contribution_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contribution" ("amount", "createdAt", "guestEmail", "guestName", "id", "message", "status") SELECT "amount", "createdAt", "guestEmail", "guestName", "id", "message", "status" FROM "Contribution";
DROP TABLE "Contribution";
ALTER TABLE "new_Contribution" RENAME TO "Contribution";
CREATE INDEX "Contribution_listId_idx" ON "Contribution"("listId");
CREATE TABLE "new_Withdrawal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "listId" TEXT NOT NULL,
    CONSTRAINT "Withdrawal_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Withdrawal" ("amount", "createdAt", "id", "status") SELECT "amount", "createdAt", "id", "status" FROM "Withdrawal";
DROP TABLE "Withdrawal";
ALTER TABLE "new_Withdrawal" RENAME TO "Withdrawal";
CREATE INDEX "Withdrawal_listId_idx" ON "Withdrawal"("listId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "List_ownerId_idx" ON "List"("ownerId");

-- CreateIndex
CREATE INDEX "ListItem_listId_idx" ON "ListItem"("listId");
