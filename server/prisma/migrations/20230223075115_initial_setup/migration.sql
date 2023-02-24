-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reptile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Reptile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feeding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reptileId" INTEGER NOT NULL,
    "foodItem" TEXT NOT NULL,
    CONSTRAINT "Feeding_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HusbandryRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "length" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "humidity" REAL NOT NULL,
    "reptileId" INTEGER NOT NULL,
    CONSTRAINT "HusbandryRecord_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monday" BOOLEAN NOT NULL,
    "tuesday" BOOLEAN NOT NULL,
    "wednesday" BOOLEAN NOT NULL,
    "thursday" BOOLEAN NOT NULL,
    "friday" BOOLEAN NOT NULL,
    "saturday" BOOLEAN NOT NULL,
    "sunday" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "reptileId" INTEGER NOT NULL,
    CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Schedule_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
