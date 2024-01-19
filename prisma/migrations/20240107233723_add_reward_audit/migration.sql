-- CreateTable
CREATE TABLE "UserModelRewardAudit" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "modelId" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModelRewardAudit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserModelRewardAudit" ADD CONSTRAINT "UserModelRewardAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
