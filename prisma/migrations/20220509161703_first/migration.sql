-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TUTOR', 'PARENT', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'TUTOR',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER,
    "acadStatus" TEXT,
    "UEE" INTEGER,
    "cGPA" DECIMAL(65,30),
    "field" VARCHAR(50),
    "college" TEXT,
    "volenteerism" TEXT,
    "prevTutored" BOOLEAN,
    "prevTutorGrades" TEXT[],
    "prevTutorExperience" TEXT,
    "idealTutor" TEXT,
    "preferredBank" TEXT,
    "bankAccountNo" TEXT,
    "contactName" TEXT,
    "contactPhone1" VARCHAR(15),
    "contactPhone2" VARCHAR(15),
    "contactEmail" VARCHAR(50),
    "workDays" INTEGER,
    "workHour" INTEGER,
    "experience" BOOLEAN,
    "subjects" TEXT[],
    "location" VARCHAR(50) NOT NULL,
    "essay" TEXT,
    "hobby" TEXT,
    "profilePicture" TEXT,
    "hiredJobId" INTEGER,
    "role" "Role" NOT NULL DEFAULT E'TUTOR',
    "status" "Status" NOT NULL DEFAULT E'PENDING',
    "userId" INTEGER,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50),
    "subtitle" VARCHAR(50),
    "subjects" TEXT[],
    "location" TEXT NOT NULL,
    "grade" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "workDays" INTEGER,
    "workHour" INTEGER,
    "hiredTutorId" INTEGER,
    "status" "Status" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "professionality" TEXT,
    "semiTotalHour" TEXT,
    "noDays" TEXT,
    "feedback" TEXT,
    "envChallenge" TEXT,
    "tuteeChallenge" TEXT,
    "yourChallenge" TEXT,
    "envResponse" TEXT,
    "tuteeResponse" TEXT,
    "yourResponse" TEXT,
    "envHelp" TEXT,
    "tuteeHelp" TEXT,
    "yourHelp" TEXT,
    "quiz" TEXT,
    "assg" TEXT,
    "test" TEXT,
    "subjects" TEXT,
    "topics" TEXT,
    "reportdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutorId" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50),
    "phone1" VARCHAR(15),
    "phone2" VARCHAR(15),
    "location" VARCHAR(50) NOT NULL,
    "preferredBank" VARCHAR(50),
    "profilePicture" TEXT,
    "role" "Role" NOT NULL DEFAULT E'PARENT',
    "status" "Status" NOT NULL DEFAULT E'PENDING',
    "userId" INTEGER,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'ADMIN',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "nickName" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "age" INTEGER,
    "subjects" TEXT[],
    "grade" TEXT,
    "school" TEXT,
    "address" TEXT,
    "hobby" TEXT,
    "prevTutored" BOOLEAN,
    "prevTutorExperience" TEXT,
    "idealTutor" TEXT,
    "workDays" INTEGER,
    "workHour" INTEGER,
    "tutorId" INTEGER,
    "parentId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobToTutor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_email_key" ON "Tutor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_userId_key" ON "Tutor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_userId_key" ON "Parent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_JobToTutor_AB_unique" ON "_JobToTutor"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToTutor_B_index" ON "_JobToTutor"("B");

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToTutor" ADD FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToTutor" ADD FOREIGN KEY ("B") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
