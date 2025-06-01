/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "articlenr" TEXT NOT NULL DEFAULT '0',
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "traits" TEXT,
    "deliveryCost" REAL NOT NULL DEFAULT 6.95,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("articlenr", "categoryId", "deliveryCost", "description", "id", "inStock", "isNew", "name", "price", "traits") SELECT "articlenr", "categoryId", "deliveryCost", "description", "id", "inStock", "isNew", "name", "price", "traits" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
