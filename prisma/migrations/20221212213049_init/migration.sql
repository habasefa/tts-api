/*
  Warnings:

  - You are about to drop the column `assg` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `envChallenge` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `envHelp` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `envResponse` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `noDays` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `professionality` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `quiz` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportdate` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `semiTotalHour` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `subjects` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `topics` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tuteeChallenge` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tuteeHelp` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tuteeResponse` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `yourChallenge` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `yourHelp` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `yourResponse` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "assg",
DROP COLUMN "envChallenge",
DROP COLUMN "envHelp",
DROP COLUMN "envResponse",
DROP COLUMN "feedback",
DROP COLUMN "noDays",
DROP COLUMN "professionality",
DROP COLUMN "quiz",
DROP COLUMN "reportdate",
DROP COLUMN "semiTotalHour",
DROP COLUMN "subjects",
DROP COLUMN "test",
DROP COLUMN "topics",
DROP COLUMN "tuteeChallenge",
DROP COLUMN "tuteeHelp",
DROP COLUMN "tuteeResponse",
DROP COLUMN "yourChallenge",
DROP COLUMN "yourHelp",
DROP COLUMN "yourResponse",
ADD COLUMN     "reports" JSONB;
