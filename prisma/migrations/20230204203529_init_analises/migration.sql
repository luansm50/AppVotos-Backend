/*
  Warnings:

  - You are about to drop the `analise_teste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "analise_teste";

-- CreateTable
CREATE TABLE "analises" (
    "itemId" TEXT NOT NULL,
    "anos" TEXT[],
    "tiposProposicao" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "analises_pkey" PRIMARY KEY ("itemId")
);
