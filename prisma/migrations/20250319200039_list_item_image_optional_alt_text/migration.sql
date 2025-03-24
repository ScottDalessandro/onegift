-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListItemImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "listItemId" TEXT NOT NULL,
    CONSTRAINT "ListItemImage_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "ListItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListItemImage" ("altText", "createdAt", "id", "listItemId", "objectKey", "updatedAt", "url") SELECT "altText", "createdAt", "id", "listItemId", "objectKey", "updatedAt", "url" FROM "ListItemImage";
DROP TABLE "ListItemImage";
ALTER TABLE "new_ListItemImage" RENAME TO "ListItemImage";
CREATE INDEX "ListItemImage_listItemId_idx" ON "ListItemImage"("listItemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
