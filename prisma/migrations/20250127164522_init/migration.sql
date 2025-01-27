-- CreateTable
CREATE TABLE "Registry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "planType" TEXT NOT NULL DEFAULT 'free',
    "goalAmount" DECIMAL NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Registry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "url" TEXT,
    "imageUrl" TEXT,
    "registryId" TEXT NOT NULL,
    CONSTRAINT "RegistryItem_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "registryId" TEXT NOT NULL,
    CONSTRAINT "Contribution_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "registryId" TEXT NOT NULL,
    CONSTRAINT "Withdrawal_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "interests" JSONB NOT NULL DEFAULT [],
    "dreams" JSONB NOT NULL DEFAULT [],
    "currentActivities" JSONB NOT NULL DEFAULT [],
    "upcomingActivities" JSONB NOT NULL DEFAULT [],
    "registryId" TEXT NOT NULL,
    CONSTRAINT "ChildProfile_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    CONSTRAINT "Milestone_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfilePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "caption" TEXT,
    "profileId" TEXT NOT NULL,
    CONSTRAINT "ProfilePhoto_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Registry_userId_idx" ON "Registry"("userId");

-- CreateIndex
CREATE INDEX "RegistryItem_registryId_idx" ON "RegistryItem"("registryId");

-- CreateIndex
CREATE INDEX "Contribution_registryId_idx" ON "Contribution"("registryId");

-- CreateIndex
CREATE INDEX "Withdrawal_registryId_idx" ON "Withdrawal"("registryId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildProfile_registryId_key" ON "ChildProfile"("registryId");

-- CreateIndex
CREATE INDEX "Milestone_profileId_idx" ON "Milestone"("profileId");

-- CreateIndex
CREATE INDEX "ProfilePhoto_profileId_idx" ON "ProfilePhoto"("profileId");
