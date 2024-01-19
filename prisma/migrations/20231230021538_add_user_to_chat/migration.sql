/*
  Warnings:

  - Added the required column `userId` to the `ModelChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelChat" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;
