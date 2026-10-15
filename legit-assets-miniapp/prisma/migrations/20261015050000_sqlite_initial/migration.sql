-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegramId" BIGINT,
    "email" TEXT,
    "emailVerifiedAt" DATETIME,
    "passwordHash" TEXT,
    "onboardingStartedAt" DATETIME,
    "onboardingCompletedAt" DATETIME,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarBytes" BLOB,
    "avatarUpdatedAt" DATETIME,
    "displayName" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'uk',
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_identity_check" CHECK ("telegramId" IS NOT NULL OR "email" IS NOT NULL),
    CONSTRAINT "User_email_normalized_check" CHECK ("email" IS NULL OR ("email" = lower(trim("email")) AND length("email") > 3))
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" TEXT NOT NULL DEFAULT '0',
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wallet_balance_check" CHECK (CAST("balance" AS NUMERIC) >= 0)
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    PRIMARY KEY ("categoryId", "locale"),
    CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandAssetId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "verificationGroup" TEXT,
    "kind" TEXT NOT NULL,
    "fulfillmentMode" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT,
    "providerProductId" TEXT,
    "attributes" JSONB,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_brandAssetId_fkey" FOREIGN KEY ("brandAssetId") REFERENCES "BrandAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_price_check" CHECK (CAST("price" AS NUMERIC) >= 0),
    CONSTRAINT "Product_quantity_check" CHECK ("minQuantity" > 0 AND "maxQuantity" >= "minQuantity"
    AND ("kind" <> 'UNIQUE' OR ("minQuantity" = 1 AND "maxQuantity" = 1))),
    CONSTRAINT "Product_verification_group_check" CHECK ("verificationGroup" IS NULL OR "verificationGroup" IN ('exchange','wallet','other')),
    CONSTRAINT "Product_version_check" CHECK ("version" >= 0)
);

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("productId", "locale"),
    CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "encryptedPayload" TEXT NOT NULL,
    "orderItemId" TEXT,
    "reservedUntil" DATETIME,
    "soldAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItem_assignment_check" CHECK (("status" = 'RESERVED' AND "orderItemId" IS NOT NULL AND "reservedUntil" IS NOT NULL)
    OR ("status" = 'SOLD' AND "orderItemId" IS NOT NULL AND "soldAt" IS NOT NULL)
    OR ("status" IN ('AVAILABLE', 'DISABLED') AND "orderItemId" IS NULL))
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "channel" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "requestHash" TEXT,
    "paidAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_total_check" CHECK (CAST("total" AS NUMERIC) >= 0)
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "requestData" JSONB,
    "titleSnapshot" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotal" TEXT NOT NULL DEFAULT '0',
    "unitPrice" TEXT NOT NULL,
    "fulfillmentMode" TEXT NOT NULL,
    "fulfillmentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerOrderId" TEXT,
    "assignedToId" TEXT,
    "encryptedDelivery" TEXT,
    "deliveredAt" DATETIME,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_quantity_check" CHECK ("quantity" > 0),
    CONSTRAINT "OrderItem_price_check" CHECK (CAST("unitPrice" AS NUMERIC) >= 0),
    CONSTRAINT "OrderItem_line_total_check" CHECK (CAST("lineTotal" AS NUMERIC) >= 0)
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "orderId" TEXT,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "provider" TEXT,
    "providerReference" TEXT,
    "postedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_amount_check" CHECK (("kind" IN ('DEPOSIT', 'REFUND') AND CAST("amount" AS NUMERIC) > 0)
    OR ("kind" = 'PURCHASE' AND CAST("amount" AS NUMERIC) < 0)
    OR ("kind" = 'ADJUSTMENT' AND CAST("amount" AS NUMERIC) <> 0))
);

-- CreateTable
CREATE TABLE "SmmJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderItemId" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "providerServiceId" TEXT NOT NULL,
    "providerFingerprint" TEXT NOT NULL,
    "targetLink" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "maxCharge" TEXT NOT NULL,
    "providerCurrency" TEXT NOT NULL,
    "providerOrderId" TEXT,
    "state" TEXT NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" DATETIME,
    "remaining" INTEGER,
    "lastErrorCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SmmJob_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SmmJob_positive_quantity" CHECK ("quantity" > 0),
    CONSTRAINT "SmmJob_positive_charge" CHECK (CAST("maxCharge" AS NUMERIC) > 0),
    CONSTRAINT "SmmJob_nonnegative_remaining" CHECK ("remaining" IS NULL OR "remaining" >= 0),
    CONSTRAINT "SmmJob_provider_order_required" CHECK ("state" NOT IN ('RUNNING', 'COMPLETED', 'PARTIAL', 'CANCELED') OR "providerOrderId" IS NOT NULL)
);

-- CreateTable
CREATE TABLE "BrandAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pngBytes" BLOB,
    "color" TEXT NOT NULL DEFAULT '#a78bfa',
    "group" TEXT NOT NULL DEFAULT 'exchange',
    "sourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BrandAsset_local_image_check" CHECK ("imageUrl" LIKE '/assets/%' OR ("imageUrl" = '/api/assets/brands/' || "id" AND "pngBytes" IS NOT NULL)),
    CONSTRAINT "BrandAsset_group_check" CHECK ("group" IN ('exchange','wallet','other'))
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminLoginBucket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "AdminLoginBucket_attempts_check" CHECK ("attempts" >= 0)
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'WEB',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "provider" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'CREATING',
    "walletCurrency" TEXT NOT NULL,
    "creditAmount" TEXT NOT NULL,
    "expectedAmount" TEXT NOT NULL,
    "expectedCurrency" TEXT NOT NULL,
    "providerReference" TEXT,
    "chargeId" TEXT,
    "preCheckoutId" TEXT,
    "paymentUrl" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentIntent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentIntent_credit_check" CHECK (CAST("creditAmount" AS NUMERIC) > 0)
);

-- CreateTable
CREATE TABLE "FulfillmentJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderItemId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" DATETIME,
    "lastErrorCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FulfillmentJob_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketplaceReservation" (
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "orderItemId" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegramId" BIGINT NOT NULL,
    "orderId" TEXT,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "deduplicationKey" TEXT NOT NULL,
    "deliveredAt" DATETIME,
    "leaseUntil" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastErrorCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CartHandoff" (
    "tokenHash" TEXT NOT NULL PRIMARY KEY,
    "entries" JSONB NOT NULL,
    "locale" TEXT NOT NULL,
    "claimedById" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ServiceHeartbeat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSuccessAt" DATETIME,
    "lastErrorCode" TEXT
);

-- CreateTable
CREATE TABLE "NftWalletProof" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "payload" TEXT NOT NULL,
    "address" TEXT,
    "expiresAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NftPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nftAddress" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "previousOwner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseNano" TEXT NOT NULL,
    "feeNano" TEXT NOT NULL,
    "transaction" JSONB NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PREPARED',
    "expiresAt" DATETIME NOT NULL,
    "deliveredAt" DATETIME,
    "feeTxHash" TEXT,
    "deliveryTxHash" TEXT,
    "feePendingUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_lastActiveAt_idx" ON "User"("role", "lastActiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_currency_key" ON "Wallet"("userId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_active_price_idx" ON "Product"("categoryId", "active", "price");

-- CreateIndex
CREATE UNIQUE INDEX "Product_provider_providerProductId_key" ON "Product"("provider", "providerProductId");

-- CreateIndex
CREATE INDEX "InventoryItem_productId_status_idx" ON "InventoryItem"("productId", "status");

-- CreateIndex
CREATE INDEX "InventoryItem_status_reservedUntil_idx" ON "InventoryItem"("status", "reservedUntil");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_idempotencyKey_key" ON "Order"("userId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "OrderItem_fulfillmentMode_fulfillmentStatus_idx" ON "OrderItem"("fulfillmentMode", "fulfillmentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_provider_providerOrderId_key" ON "OrderItem"("provider", "providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotencyKey_key" ON "Transaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Transaction_walletId_createdAt_idx" ON "Transaction"("walletId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_provider_providerReference_key" ON "Transaction"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "SmmJob_orderItemId_key" ON "SmmJob"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SmmJob_providerOrderId_key" ON "SmmJob"("providerOrderId");

-- CreateIndex
CREATE INDEX "SmmJob_state_runAt_idx" ON "SmmJob"("state", "runAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AdminLoginBucket_expiresAt_idx" ON "AdminLoginBucket"("expiresAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityId_createdAt_idx" ON "AdminAuditLog"("entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

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

-- CreateIndex
CREATE INDEX "CartHandoff_expiresAt_idx" ON "CartHandoff"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "NftWalletProof_payload_key" ON "NftWalletProof"("payload");

-- CreateIndex
CREATE INDEX "NftWalletProof_expiresAt_idx" ON "NftWalletProof"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "NftPurchase_feeTxHash_key" ON "NftPurchase"("feeTxHash");

-- CreateIndex
CREATE UNIQUE INDEX "NftPurchase_deliveryTxHash_key" ON "NftPurchase"("deliveryTxHash");

-- CreateIndex
CREATE INDEX "NftPurchase_userId_createdAt_idx" ON "NftPurchase"("userId", "createdAt");

