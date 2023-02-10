/*
  Warnings:

  - You are about to drop the column `cuantity` on the `ProductsOnCarts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductsOnCarts" DROP COLUMN "cuantity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
