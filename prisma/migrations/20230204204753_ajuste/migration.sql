/*
  Warnings:

  - The primary key for the `analises` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `analises` table. All the data in the column will be lost.
  - Added the required column `id` to the `analises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analises" DROP CONSTRAINT "analises_pkey",
DROP COLUMN "itemId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "analises_pkey" PRIMARY KEY ("id");
