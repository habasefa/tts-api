/*
  Warnings:

  - You are about to drop the column `reports` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reports",
ADD COLUMN     "nreports" JSONB;
