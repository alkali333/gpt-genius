/*
  Warnings:

  - You are about to drop the column `current_tasks` on the `MindState` table. All the data in the column will be lost.
  - You are about to drop the column `grateful_for` on the `MindState` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Diary" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'evening';

-- AlterTable
ALTER TABLE "MindState" DROP COLUMN "current_tasks",
DROP COLUMN "grateful_for",
ADD COLUMN     "latest_evening_journal_entry" TEXT,
ADD COLUMN     "latest_morning_journal_entry" TEXT;

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "Tour";
