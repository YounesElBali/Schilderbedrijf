/*
  Warnings:

  - You are about to drop the `Imges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traits` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "traits" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Imges";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Traits";
PRAGMA foreign_keys=on;
