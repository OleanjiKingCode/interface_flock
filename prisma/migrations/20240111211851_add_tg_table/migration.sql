-- CreateTable
CREATE TABLE "UserTelegramData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL DEFAULT '',
    "telegramFirstName" TEXT NOT NULL DEFAULT '',
    "telegramLastName" TEXT NOT NULL DEFAULT '',
    "telegramUsername" TEXT NOT NULL DEFAULT '',
    "telegramHash" TEXT NOT NULL DEFAULT '',
    "telegramAuthDate" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTelegramData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTelegramData_userId_key" ON "UserTelegramData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTelegramData_telegramId_key" ON "UserTelegramData"("telegramId");

-- AddForeignKey
ALTER TABLE "UserTelegramData" ADD CONSTRAINT "UserTelegramData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
