/*
  Warnings:

  - Changed the type of `hopes_and_dreams` on the `MindState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skills_and_achievements` on the `MindState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `obstacles_and_challenges` on the `MindState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `grateful_for` on the `MindState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `current_tasks` on the `MindState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MindState" DROP COLUMN "hopes_and_dreams",
ADD COLUMN     "hopes_and_dreams" JSONB NOT NULL,
DROP COLUMN "skills_and_achievements",
ADD COLUMN     "skills_and_achievements" JSONB NOT NULL,
DROP COLUMN "obstacles_and_challenges",
ADD COLUMN     "obstacles_and_challenges" JSONB NOT NULL,
DROP COLUMN "grateful_for",
ADD COLUMN     "grateful_for" JSONB NOT NULL,
DROP COLUMN "current_tasks",
ADD COLUMN     "current_tasks" JSONB NOT NULL;
