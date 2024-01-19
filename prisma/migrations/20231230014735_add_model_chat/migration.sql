-- CreateTable
CREATE TABLE "ModelChat" (
    "id" TEXT NOT NULL,
    "modelId" VARCHAR(255) NOT NULL,
    "question" VARCHAR NOT NULL,
    "answer" VARCHAR NOT NULL,
    "vote" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelChat_pkey" PRIMARY KEY ("id")
);
