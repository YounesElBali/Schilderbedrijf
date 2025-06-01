/*
  Warnings:

  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImageUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `traits` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductImageUsage_productId_imageId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductImageUsage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Icons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductProductImage" (
    "productId" INTEGER NOT NULL,
    "productImageId" INTEGER NOT NULL,

    PRIMARY KEY ("productId", "productImageId"),
    CONSTRAINT "ProductProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductProductImage_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "Icons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "articlenr" TEXT NOT NULL DEFAULT '0',
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "deliveryCost" REAL NOT NULL DEFAULT 6.95,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("articlenr", "categoryId", "deliveryCost", "description", "id", "image", "inStock", "isNew", "name", "price") SELECT "articlenr", "categoryId", "deliveryCost", "description", "id", "image", "inStock", "isNew", "name", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
