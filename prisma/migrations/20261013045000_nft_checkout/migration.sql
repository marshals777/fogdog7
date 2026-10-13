CREATE TABLE "NftWalletProof" ("userId" TEXT PRIMARY KEY,"payload" TEXT NOT NULL,"address" TEXT,"expiresAt" TIMESTAMP(3) NOT NULL);
CREATE UNIQUE INDEX "NftWalletProof_payload_key" ON "NftWalletProof"("payload");
CREATE TABLE "NftPurchase" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL,"nftAddress" TEXT NOT NULL,"walletAddress" TEXT NOT NULL,"previousOwner" TEXT NOT NULL,"name" TEXT NOT NULL,"baseNano" TEXT NOT NULL,"feeNano" TEXT NOT NULL,"transaction" JSONB NOT NULL,"state" TEXT NOT NULL DEFAULT 'PREPARED',"expiresAt" TIMESTAMP(3) NOT NULL,"deliveredAt" TIMESTAMP(3),"feeTxHash" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX "NftPurchase_feeTxHash_key" ON "NftPurchase"("feeTxHash");
CREATE INDEX "NftPurchase_userId_createdAt_idx" ON "NftPurchase"("userId","createdAt");

ALTER TABLE "NftPurchase" ADD COLUMN "deliveryTxHash" TEXT, ADD COLUMN "feePendingUntil" TIMESTAMP(3);
CREATE UNIQUE INDEX "NftPurchase_deliveryTxHash_key" ON "NftPurchase"("deliveryTxHash");
