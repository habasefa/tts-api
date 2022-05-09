-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
