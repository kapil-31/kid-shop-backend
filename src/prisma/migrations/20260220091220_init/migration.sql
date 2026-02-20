/*
  Warnings:

  - You are about to drop the column `billingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `OrderAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddressId",
DROP COLUMN "shippingAddressId",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "addressId",
ALTER COLUMN "updatedAt" DROP DEFAULT;
