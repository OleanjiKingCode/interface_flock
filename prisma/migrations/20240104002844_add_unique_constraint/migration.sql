/*
  Warnings:

  - A unique constraint covering the columns `[userId,modelId]` on the table `UserModelReward` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserModelReward_userId_modelId_key" ON "UserModelReward"("userId", "modelId");
