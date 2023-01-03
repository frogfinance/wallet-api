/*
  Warnings:

  - You are about to drop the `UserWalletPin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserWalletPin" DROP CONSTRAINT "UserWalletPin_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWalletPin" DROP CONSTRAINT "UserWalletPin_walletId_fkey";

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "name" VARCHAR(256);

-- AlterTable
ALTER TABLE "WalletSalt" ADD COLUMN     "keySalt" VARCHAR(255);

-- DropTable
DROP TABLE "UserWalletPin";

-- CreateTable
CREATE TABLE "UserPin" (
    "id" SERIAL NOT NULL,
    "pin" TEXT,
    "resetAttempts" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPin_userId_key" ON "UserPin"("userId");

-- CreateIndex
CREATE INDEX "UserPin_userId_idx" ON "UserPin" USING HASH ("userId");

-- AddForeignKey
ALTER TABLE "UserPin" ADD CONSTRAINT "UserPin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
