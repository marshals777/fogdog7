CREATE TABLE "CartHandoff" (
 "tokenHash" TEXT NOT NULL PRIMARY KEY,
 "entries" JSONB NOT NULL,
 "locale" "Locale" NOT NULL,
 "claimedById" TEXT,
 "expiresAt" TIMESTAMP(3) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "CartHandoff_expiresAt_idx" ON "CartHandoff"("expiresAt");
