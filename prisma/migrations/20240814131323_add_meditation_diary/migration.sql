-- CreateTable
CREATE TABLE "MeditationDiary" (
    "id" SERIAL NOT NULL,
    "entry" TEXT NOT NULL,
    "summary" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "MeditationDiary_pkey" PRIMARY KEY ("id")
);
