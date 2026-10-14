-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('CREATING', 'PENDING', 'PAID', 'FAILED', 'UNKNOWN', 'REFUNDING', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "requestHash" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "lineTotal" DECIMAL(20,6) NOT NULL DEFAULT 0,
ADD COLUMN     "requestData" JSONB;

-- AlterTable
ALTER TABLE "BrandAsset" ADD COLUMN     "pngBytes" BYTEA;

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "Channel" NOT NULL DEFAULT 'WEB',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "purpose" TEXT NOT NULL,
    "state" "PaymentState" NOT NULL DEFAULT 'CREATING',
    "walletCurrency" "Currency" NOT NULL,
    "creditAmount" DECIMAL(20,6) NOT NULL,
    "expectedAmount" TEXT NOT NULL,
    "expectedCurrency" TEXT NOT NULL,
    "providerReference" TEXT,
    "chargeId" TEXT,
    "preCheckoutId" TEXT,
    "paymentUrl" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FulfillmentJob" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "state" "SmmJobState" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMP(3),
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FulfillmentJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceReservation" (
    "itemId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceReservation_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "orderId" TEXT,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "deduplicationKey" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "leaseUntil" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_tokenHash_key" ON "UserSession"("tokenHash");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_chargeId_key" ON "PaymentIntent"("chargeId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_preCheckoutId_key" ON "PaymentIntent"("preCheckoutId");

-- CreateIndex
CREATE INDEX "PaymentIntent_state_expiresAt_idx" ON "PaymentIntent"("state", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_userId_idempotencyKey_key" ON "PaymentIntent"("userId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_provider_providerReference_key" ON "PaymentIntent"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentJob_orderItemId_key" ON "FulfillmentJob"("orderItemId");

-- CreateIndex
CREATE INDEX "FulfillmentJob_state_runAt_idx" ON "FulfillmentJob"("state", "runAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceReservation_orderItemId_key" ON "MarketplaceReservation"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_deduplicationKey_key" ON "Notification"("deduplicationKey");

-- CreateIndex
CREATE INDEX "Notification_deliveredAt_createdAt_idx" ON "Notification"("deliveredAt", "createdAt");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FulfillmentJob" ADD CONSTRAINT "FulfillmentJob_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

