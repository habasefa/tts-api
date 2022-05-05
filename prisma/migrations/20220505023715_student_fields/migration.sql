/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "birthDay",
ADD COLUMN     "age" INTEGER;
