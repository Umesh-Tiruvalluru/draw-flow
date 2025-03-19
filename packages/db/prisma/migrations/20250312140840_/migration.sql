/*
  Warnings:

  - Added the required column `imageId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "imageId" INTEGER NOT NULL,
ADD COLUMN     "isFavourite" BOOLEAN NOT NULL DEFAULT false;
