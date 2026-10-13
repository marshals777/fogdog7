-- Permit only local bundled images or the authenticated-admin PNG storage endpoint.
ALTER TABLE "BrandAsset" DROP CONSTRAINT "BrandAsset_local_image_check";
ALTER TABLE "BrandAsset" ADD CONSTRAINT "BrandAsset_local_image_check"
  CHECK ("imageUrl" LIKE '/assets/%' OR ("imageUrl" = '/api/assets/brands/' || "id" AND "pngBytes" IS NOT NULL));
UPDATE "OrderItem" SET "lineTotal" = "unitPrice" * "quantity" WHERE "lineTotal" = 0;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_line_total_check" CHECK ("lineTotal" >= 0);
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_credit_check" CHECK ("creditAmount" > 0);
