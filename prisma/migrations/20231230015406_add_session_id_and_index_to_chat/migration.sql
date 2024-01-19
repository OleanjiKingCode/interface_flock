/*
  Warnings:

  - Added the required column `sessionId` to the `ModelChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelChat" ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionId" VARCHAR NOT NULL;
