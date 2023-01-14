/*
  Warnings:

  - Added the required column `reportDate` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportMonth` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportYear` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reportDate" INTEGER NOT NULL,
ADD COLUMN     "reportMonth" INTEGER NOT NULL,
ADD COLUMN     "reportYear" INTEGER NOT NULL;
