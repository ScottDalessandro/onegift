/*
  Warnings:

  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listTypeId` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- Drop existing data
DELETE FROM "List";
DELETE FROM "Event";

-- CreateTable
CREATE TABLE "ListType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create default list types
INSERT INTO "ListType" ("id", "name", "description", "createdAt", "updatedAt")
VALUES 
    ('birthday', 'Birthday', 'Birthday gift registry', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('wedding', 'Wedding', 'Wedding gift registry', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('baby-shower', 'Baby Shower', 'Baby shower gift registry', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('other', 'Other', 'Other type of gift registry', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateTable
CREATE TABLE "ListInvitee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    CONSTRAINT "ListInvitee_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventGuest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "EventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListGiftStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "purchaserName" TEXT,
    "purchaserEmail" TEXT,
    "listItemId" TEXT NOT NULL,
    CONSTRAINT "ListGiftStatus_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "ListItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "location" TEXT,
    "description" TEXT
);
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "listTypeId" TEXT NOT NULL,
    "eventId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planType" TEXT NOT NULL DEFAULT 'free',
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "List_listTypeId_fkey" FOREIGN KEY ("listTypeId") REFERENCES "ListType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "List_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "List_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE INDEX "List_ownerId_idx" ON "List"("ownerId");
CREATE INDEX "List_listTypeId_idx" ON "List"("listTypeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ListType_name_key" ON "ListType"("name");

-- CreateIndex
CREATE INDEX "ListInvitee_listId_idx" ON "ListInvitee"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "ListInvitee_listId_email_key" ON "ListInvitee"("listId", "email");

-- CreateIndex
CREATE INDEX "EventGuest_eventId_idx" ON "EventGuest"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventGuest_eventId_email_key" ON "EventGuest"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "ListGiftStatus_listItemId_key" ON "ListGiftStatus"("listItemId");
