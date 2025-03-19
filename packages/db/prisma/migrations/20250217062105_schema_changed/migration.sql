/*
  Warnings:

  - You are about to drop the `Shape` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shapes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ElementType" AS ENUM ('RECT', 'CIRCLE', 'LINE');

-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_shapesId_fkey";

-- DropForeignKey
ALTER TABLE "Shapes" DROP CONSTRAINT "Shapes_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Shapes" DROP CONSTRAINT "Shapes_userId_fkey";

-- DropTable
DROP TABLE "Shape";

-- DropTable
DROP TABLE "Shapes";

-- DropEnum
DROP TYPE "ShapeType";

-- CreateTable
CREATE TABLE "Elements" (
    "id" SERIAL NOT NULL,
    "type" "ElementType" NOT NULL,
    "data" JSONB NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Elements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Elements" ADD CONSTRAINT "Elements_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elements" ADD CONSTRAINT "Elements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
