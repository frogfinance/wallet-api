/*
  Warnings:

  - Added the required column `userId` to the `TransactionData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionData" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "TransactionData_userId_idx" ON "TransactionData" USING HASH ("userId");
