/*
  Warnings:

  - You are about to drop the column `latest_evening_journal_entry` on the `MindState` table. All the data in the column will be lost.
  - You are about to drop the column `latest_morning_journal_entry` on the `MindState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MindState" DROP COLUMN "latest_evening_journal_entry",
DROP COLUMN "latest_morning_journal_entry";
