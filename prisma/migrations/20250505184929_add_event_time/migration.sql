/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ListItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN "eventTime" TEXT;

-- CreateTable
CREATE TABLE "ListItemImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "objectKey" TEXT,
    "altText" TEXT,
    "listItemId" TEXT NOT NULL,
    CONSTRAINT "ListItemImage_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "ListItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "url" TEXT,
    "category" TEXT,
    "listId" TEXT NOT NULL,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListItem" ("category", "createdAt", "description", "id", "listId", "name", "price", "updatedAt", "url") SELECT "category", "createdAt", "description", "id", "listId", "name", "price", "updatedAt", "url" FROM "ListItem";
DROP TABLE "ListItem";
ALTER TABLE "new_ListItem" RENAME TO "ListItem";
CREATE INDEX "ListItem_listId_idx" ON "ListItem"("listId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ListItemImage_listItemId_idx" ON "ListItemImage"("listItemId");
