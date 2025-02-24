/*
  Warnings:

  - You are about to drop the column `blob` on the `NoteImage` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `NoteImage` table. All the data in the column will be lost.
  - You are about to drop the column `blob` on the `UserImage` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `UserImage` table. All the data in the column will be lost.
*/
-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aaguid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicKey" BLOB NOT NULL,
    "userId" TEXT NOT NULL,
    "webauthnUserId" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NoteImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT, -- Changed to nullable initially
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "NoteImage_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NoteImage" ("altText", "createdAt", "id", "noteId", "updatedAt") SELECT "altText", "createdAt", "id", "noteId", "updatedAt" FROM "NoteImage";

-- Update existing records with a default value
UPDATE "new_NoteImage" SET "objectKey" = 'legacy-' || id WHERE "objectKey" IS NULL;

-- Now make the column NOT NULL
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NoteImage_temp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "NoteImage_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NoteImage_temp" SELECT * FROM "new_NoteImage";
DROP TABLE "new_NoteImage";
ALTER TABLE "new_NoteImage_temp" RENAME TO "new_NoteImage";

DROP TABLE "NoteImage";
ALTER TABLE "new_NoteImage" RENAME TO "NoteImage";
CREATE INDEX "NoteImage_noteId_idx" ON "NoteImage"("noteId");

CREATE TABLE "new_UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT, -- Changed to nullable initially
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserImage" ("altText", "createdAt", "id", "updatedAt", "userId") SELECT "altText", "createdAt", "id", "updatedAt", "userId" FROM "UserImage";

-- Update existing records with a default value
UPDATE "new_UserImage" SET "objectKey" = 'legacy-' || id WHERE "objectKey" IS NULL;

-- Now make the column NOT NULL
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserImage_temp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserImage_temp" SELECT * FROM "new_UserImage";
DROP TABLE "new_UserImage";
ALTER TABLE "new_UserImage_temp" RENAME TO "new_UserImage";

DROP TABLE "UserImage";
ALTER TABLE "new_UserImage" RENAME TO "UserImage";
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Passkey_userId_idx" ON "Passkey"("userId");