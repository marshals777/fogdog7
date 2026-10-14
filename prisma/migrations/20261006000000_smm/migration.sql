-- CreateEnum
CREATE TYPE "SmmJobState" AS ENUM ('QUEUED', 'PREPARING', 'SENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'CANCELED', 'FAILED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "SmmJob" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "providerServiceId" TEXT NOT NULL,
    "providerFingerprint" TEXT NOT NULL,
    "targetLink" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "maxCharge" DECIMAL(20,6) NOT NULL,
    "providerCurrency" TEXT NOT NULL,
    "providerOrderId" TEXT,
    "state" "SmmJobState" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMP(3),
    "remaining" INTEGER,
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmmJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmmJob_orderItemId_key" ON "SmmJob"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SmmJob_providerOrderId_key" ON "SmmJob"("providerOrderId");

-- CreateIndex
CREATE INDEX "SmmJob_state_runAt_idx" ON "SmmJob"("state", "runAt");

-- AddForeignKey
ALTER TABLE "SmmJob" ADD CONSTRAINT "SmmJob_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "SmmJob" ADD CONSTRAINT "SmmJob_positive_quantity" CHECK ("quantity" > 0);
ALTER TABLE "SmmJob" ADD CONSTRAINT "SmmJob_positive_charge" CHECK ("maxCharge" > 0);
ALTER TABLE "SmmJob" ADD CONSTRAINT "SmmJob_nonnegative_remaining" CHECK ("remaining" IS NULL OR "remaining" >= 0);
ALTER TABLE "SmmJob" ADD CONSTRAINT "SmmJob_provider_order_required" CHECK ("state" NOT IN ('RUNNING', 'COMPLETED', 'PARTIAL', 'CANCELED') OR "providerOrderId" IS NOT NULL);
