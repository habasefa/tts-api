/*
  Warnings:

  - You are about to drop the column `challengeSolution` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `howCanWeHelp` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `subjectTutored` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `topicCovered` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tuteeReadiness` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tutorialDelivery` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "challengeSolution",
DROP COLUMN "comment",
DROP COLUMN "howCanWeHelp",
DROP COLUMN "subjectTutored",
DROP COLUMN "title",
DROP COLUMN "topicCovered",
DROP COLUMN "tuteeReadiness",
DROP COLUMN "tutorialDelivery",
ADD COLUMN     "assg" TEXT,
ADD COLUMN     "envHelp" TEXT,
ADD COLUMN     "envResponse" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "noDays" TEXT,
ADD COLUMN     "semiTotalHour" TEXT,
ADD COLUMN     "subjects" TEXT,
ADD COLUMN     "test" TEXT,
ADD COLUMN     "topics" TEXT,
ADD COLUMN     "tuteeChallenge" TEXT,
ADD COLUMN     "tuteeHelp" TEXT,
ADD COLUMN     "tuteeResponse" TEXT,
ADD COLUMN     "yourChallenge" TEXT,
ADD COLUMN     "yourHelp" TEXT,
ADD COLUMN     "yourResponse" TEXT;
