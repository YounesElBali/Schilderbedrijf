/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductImage` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ProductImageUsage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "isSelected" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT,
    CONSTRAINT "ProductImageUsage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductImageUsage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ProductImage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL
);
INSERT INTO "new_ProductImage" ("id", "url") SELECT "id", "url" FROM "ProductImage";
DROP TABLE "ProductImage";
ALTER TABLE "new_ProductImage" RENAME TO "ProductImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImageUsage_productId_imageId_key" ON "ProductImageUsage"("productId", "imageId");
