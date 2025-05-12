/*
  Warnings:

  - You are about to drop the column `dueDate` on the `List` table. All the data in the column will be lost.
  - Added the required column `contributionDate` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contributionDate" DATETIME NOT NULL,
    "listTypeId" TEXT NOT NULL,
    "eventId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planType" TEXT NOT NULL DEFAULT 'free',
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "List_listTypeId_fkey" FOREIGN KEY ("listTypeId") REFERENCES "ListType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "List_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "List_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_List" ("createdAt", "description", "eventId", "id", "listTypeId", "ownerId", "planType", "status", "title", "updatedAt") SELECT "createdAt", "description", "eventId", "id", "listTypeId", "ownerId", "planType", "status", "title", "updatedAt" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE INDEX "List_ownerId_idx" ON "List"("ownerId");
CREATE INDEX "List_listTypeId_idx" ON "List"("listTypeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
