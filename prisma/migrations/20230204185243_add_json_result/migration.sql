/*
  Warnings:

  - Added the required column `resultado` to the `analise_teste` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analise_teste" ADD COLUMN     "resultado" JSONB NOT NULL;
