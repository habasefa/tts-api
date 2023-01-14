/*
  Warnings:

  - Added the required column `dressing` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elequence` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedback` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `futureChallenge` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grooming` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `helpChallenge` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hygiene` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manner` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pastChallenge` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punctuality` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDays` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHours` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "dressing" TEXT NOT NULL,
ADD COLUMN     "elequence" TEXT NOT NULL,
ADD COLUMN     "feedback" TEXT NOT NULL,
ADD COLUMN     "futureChallenge" TEXT NOT NULL,
ADD COLUMN     "grooming" TEXT NOT NULL,
ADD COLUMN     "helpChallenge" TEXT NOT NULL,
ADD COLUMN     "hygiene" TEXT NOT NULL,
ADD COLUMN     "manner" TEXT NOT NULL,
ADD COLUMN     "month" TEXT NOT NULL,
ADD COLUMN     "pastChallenge" TEXT NOT NULL,
ADD COLUMN     "punctuality" TEXT NOT NULL,
ADD COLUMN     "totalDays" TEXT NOT NULL,
ADD COLUMN     "totalHours" TEXT NOT NULL,
ADD COLUMN     "week" TEXT NOT NULL;
