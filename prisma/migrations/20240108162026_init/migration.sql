/*
  Warnings:

  - Made the column `description` on table `todo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `todo` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(191) NOT NULL;
