-- CreateEnum
CREATE TYPE "Contract" AS ENUM ('ERC20', 'ERC1404', 'ERC721', 'ERC1155');

-- CreateEnum
CREATE TYPE "TxState" AS ENUM ('PENDING', 'COMPLETE', 'VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "otp" TEXT,
    "preferences" JSONB NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClaim" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "tokenId" INTEGER,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "blockchainId" INTEGER,
    "address" TEXT,
    "encrypted" VARCHAR(512),

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWalletPin" (
    "id" SERIAL NOT NULL,
    "pin" TEXT,
    "resetAttempts" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    "walletId" INTEGER,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWalletPin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletSalt" (
    "id" SERIAL NOT NULL,
    "walletId" INTEGER NOT NULL,
    "salt" VARCHAR(255),

    CONSTRAINT "WalletSalt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "hash" VARCHAR(255),
    "name" VARCHAR(255),
    "symbol" VARCHAR(16),
    "blockchainId" INTEGER,
    "decimals" INTEGER,
    "isNative" BOOLEAN NOT NULL DEFAULT false,
    "contractType" "Contract",

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hash" VARCHAR(255),
    "name" VARCHAR(255),
    "tokenInId" INTEGER NOT NULL,
    "tokenOutId" INTEGER NOT NULL,
    "blockchainId" INTEGER NOT NULL,
    "costBasis" TEXT,
    "tokenInUSDVal" TEXT,
    "tokenOutUSDVal" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTokenBalance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" VARCHAR(255),
    "nftTokenIds" JSONB NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "UserTokenBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blockchain" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "tokenId" INTEGER,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "description" VARCHAR(255),

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionData" (
    "id" SERIAL NOT NULL,
    "blockchainId" INTEGER,
    "hash" TEXT,
    "txState" "TxState" NOT NULL,
    "rawData" JSONB,
    "walletId" INTEGER,

    CONSTRAINT "TransactionData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_otp_key" ON "User"("otp");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" USING HASH ("email");

-- CreateIndex
CREATE INDEX "User_uuid_idx" ON "User" USING HASH ("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE INDEX "Wallet_address_idx" ON "Wallet" USING HASH ("address");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWalletPin_userId_key" ON "UserWalletPin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWalletPin_walletId_key" ON "UserWalletPin"("walletId");

-- CreateIndex
CREATE INDEX "UserWalletPin_walletId_idx" ON "UserWalletPin" USING HASH ("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletSalt_walletId_key" ON "WalletSalt"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletSalt_salt_key" ON "WalletSalt"("salt");

-- CreateIndex
CREATE INDEX "WalletSalt_walletId_idx" ON "WalletSalt" USING HASH ("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");

-- CreateIndex
CREATE INDEX "Token_contractType_idx" ON "Token" USING HASH ("contractType");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrades_hash_key" ON "UserTrades"("hash");

-- CreateIndex
CREATE INDEX "UserTrades_userId_idx" ON "UserTrades" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "UserTrades_hash_idx" ON "UserTrades" USING HASH ("hash");

-- CreateIndex
CREATE INDEX "UserTokenBalance_userId_idx" ON "UserTokenBalance" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionData_hash_key" ON "TransactionData"("hash");

-- CreateIndex
CREATE INDEX "TransactionData_hash_idx" ON "TransactionData" USING HASH ("hash");

-- AddForeignKey
ALTER TABLE "UserClaim" ADD CONSTRAINT "UserClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClaim" ADD CONSTRAINT "UserClaim_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWalletPin" ADD CONSTRAINT "UserWalletPin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWalletPin" ADD CONSTRAINT "UserWalletPin_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrades" ADD CONSTRAINT "UserTrades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTokenBalance" ADD CONSTRAINT "UserTokenBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTokenBalance" ADD CONSTRAINT "UserTokenBalance_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blockchain" ADD CONSTRAINT "Blockchain_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
