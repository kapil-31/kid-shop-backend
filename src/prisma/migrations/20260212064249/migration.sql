/*
  Warnings:

  - You are about to drop the `Galler` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Galler";

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);
