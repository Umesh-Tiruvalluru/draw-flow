/*
  Warnings:

  - Changed the type of `type` on the `Shape` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShapeType" AS ENUM ('RECT', 'CIRCLE');

-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "type",
ADD COLUMN     "type" "ShapeType" NOT NULL;
