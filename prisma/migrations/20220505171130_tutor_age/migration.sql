/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Tutor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "birthDay",
ADD COLUMN     "age" INTEGER;
