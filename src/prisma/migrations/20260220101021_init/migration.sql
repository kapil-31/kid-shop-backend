-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "coupon" TEXT,
ADD COLUMN     "discount" DECIMAL(65,30) DEFAULT 0;
