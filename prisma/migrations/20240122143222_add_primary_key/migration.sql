-- AlterTable
ALTER TABLE "DataContribution" ADD CONSTRAINT "DataContribution_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "UserModelRewardAudit" ADD CONSTRAINT "UserModelRewardAudit_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "DataContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModelRewardAudit" ADD CONSTRAINT "UserModelRewardAudit_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
