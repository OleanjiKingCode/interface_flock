-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "totalRewardAmount" INTEGER NOT NULL DEFAULT 0,
    "totalSlashAmount" INTEGER NOT NULL DEFAULT 0,
    "totalStakeAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDiscordData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discordId" TEXT NOT NULL DEFAULT '',
    "discordName" TEXT NOT NULL DEFAULT '',
    "discordRole" TEXT NOT NULL DEFAULT '',
    "discordVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordAccessToken" TEXT NOT NULL DEFAULT '',
    "discordExpiresAt" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "UserDiscordData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTwitterData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twitterIdstr" TEXT NOT NULL DEFAULT '',
    "twitterName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "twitterAccessToken" TEXT NOT NULL DEFAULT '',
    "twitterTweetId" TEXT NOT NULL DEFAULT '',
    "twitterExpiresAt" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "UserTwitterData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestTask" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserQuestTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "link" VARCHAR(255) NOT NULL,

    CONSTRAINT "MarketplaceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceModelLikes" (
    "id" TEXT NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,
    "userEmail" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceModelLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceModelViews" (
    "id" TEXT NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,
    "userEmail" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceModelViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceModelLikesV2" (
    "id" TEXT NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,
    "wallet" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceModelLikesV2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceModelViewsV2" (
    "id" TEXT NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,
    "wallet" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceModelViewsV2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimedRewards" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimedRewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherReport" (
    "id" TEXT NOT NULL,
    "wallet" VARCHAR(255) NOT NULL,
    "reportPath" VARCHAR(255) NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearcherReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataContribution" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filePath" TEXT NOT NULL,
    "stakeAmount" INTEGER NOT NULL DEFAULT 0,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "slashAmount" INTEGER NOT NULL DEFAULT 0,
    "upvote" INTEGER NOT NULL DEFAULT 0,
    "downvote" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "dataValidationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "modelId" TEXT NOT NULL,
    "id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Model" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelName" VARCHAR(255) NOT NULL,
    "rewardAmount" INTEGER NOT NULL DEFAULT 0,
    "upvote" INTEGER NOT NULL DEFAULT 0,
    "downvote" INTEGER NOT NULL DEFAULT 0,
    "userId" VARCHAR(255) NOT NULL,
    "dataRequired" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" VARCHAR(255),
    "modelIcon" TEXT,
    "exampleKnowledge" VARCHAR[],
    "id" TEXT NOT NULL,
    "dataValidationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataContributionUpvote" (
    "id" TEXT NOT NULL,
    "dataContributionId" VARCHAR(255) NOT NULL,
    "wallet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,

    CONSTRAINT "DataContributionUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataContributionDownvote" (
    "id" TEXT NOT NULL,
    "dataContributionId" VARCHAR(255) NOT NULL,
    "wallet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,

    CONSTRAINT "DataContributionDownvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FLock_discord_btcgpt_channels" (
    "id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "guild_name" VARCHAR NOT NULL,
    "channel_id" BIGINT,
    "channel_namee" VARCHAR,
    "Learner_Badge" VARCHAR,
    "Builder_Badge" VARCHAR,
    "is_active" BOOLEAN,
    "last_active" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FLock_discord_btcgpt_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FLock_discord_btcgpt_chat_logs" (
    "id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT,
    "channel_id" BIGINT,
    "user_id" BIGINT,
    "user_name" VARCHAR,
    "round" INTEGER,
    "data" JSONB,
    "last_interaction" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FLock_discord_btcgpt_chat_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscordData_userId_key" ON "UserDiscordData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDiscordData_discordId_key" ON "UserDiscordData"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTwitterData_userId_key" ON "UserTwitterData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTwitterData_twitterIdstr_key" ON "UserTwitterData"("twitterIdstr");

-- CreateIndex
CREATE UNIQUE INDEX "QuestTask_taskName_key" ON "QuestTask"("taskName");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestTask_userId_taskId_key" ON "UserQuestTask"("userId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimedRewards_wallet_key" ON "ClaimedRewards"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "DataContribution_id_key" ON "DataContribution"("id");

-- AddForeignKey
ALTER TABLE "UserDiscordData" ADD CONSTRAINT "UserDiscordData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTwitterData" ADD CONSTRAINT "UserTwitterData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestTask" ADD CONSTRAINT "UserQuestTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "QuestTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestTask" ADD CONSTRAINT "UserQuestTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContribution" ADD CONSTRAINT "DataContribution_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContribution" ADD CONSTRAINT "DataContribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
