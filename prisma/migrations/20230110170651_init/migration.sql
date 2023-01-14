-- CreateTable
CREATE TABLE "ParentInYear" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "parentRegisterNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ParentInYear_pkey" PRIMARY KEY ("id")
);
