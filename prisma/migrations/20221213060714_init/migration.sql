/*
  Warnings:

  - You are about to drop the column `nreports` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_tutorId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "nreports",
ADD COLUMN     "reports" JSONB;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
