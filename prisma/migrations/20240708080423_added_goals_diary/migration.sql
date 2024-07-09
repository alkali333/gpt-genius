-- CreateTable
CREATE TABLE "Diary" (
    "id" SERIAL NOT NULL,
    "entry" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MindState" (
    "id" SERIAL NOT NULL,
    "hopes_and_dreams" TEXT NOT NULL,
    "skills_and_achievements" TEXT NOT NULL,
    "obstacles_and_challenges" TEXT NOT NULL,
    "grateful_for" TEXT NOT NULL,
    "current_tasks" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MindState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MindState_clerkId_key" ON "MindState"("clerkId");
