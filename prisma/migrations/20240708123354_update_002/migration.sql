-- AlterTable
ALTER TABLE "MindState" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "hopes_and_dreams" DROP NOT NULL,
ALTER COLUMN "skills_and_achievements" DROP NOT NULL,
ALTER COLUMN "obstacles_and_challenges" DROP NOT NULL,
ALTER COLUMN "grateful_for" DROP NOT NULL,
ALTER COLUMN "current_tasks" DROP NOT NULL;
