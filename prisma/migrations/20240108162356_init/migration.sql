/*
  Warnings:

  - Made the column `age` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `age` INTEGER NOT NULL;
