CREATE TABLE "ServiceHeartbeat" (
  "id" TEXT NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSuccessAt" TIMESTAMP(3),
  "lastErrorCode" TEXT,
  CONSTRAINT "ServiceHeartbeat_pkey" PRIMARY KEY ("id")
);
