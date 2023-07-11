/*
  Warnings:

  - You are about to drop the column `captura_resolucao_altura` on the `telemetrias_ocr` table. All the data in the column will be lost.
  - You are about to drop the column `captura_resolucao_largura` on the `telemetrias_ocr` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telemetrias_ocr" DROP COLUMN "captura_resolucao_altura",
DROP COLUMN "captura_resolucao_largura",
ADD COLUMN     "captura_resolucao" TEXT;
