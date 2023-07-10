/*
  Warnings:

  - You are about to drop the column `camera_endereco` on the `telemetrias_ocr` table. All the data in the column will be lost.
  - You are about to drop the column `camera_latitude` on the `telemetrias_ocr` table. All the data in the column will be lost.
  - You are about to drop the column `camera_longitude` on the `telemetrias_ocr` table. All the data in the column will be lost.
  - You are about to drop the column `camera_nome` on the `telemetrias_ocr` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telemetrias_ocr" DROP COLUMN "camera_endereco",
DROP COLUMN "camera_latitude",
DROP COLUMN "camera_longitude",
DROP COLUMN "camera_nome",
ADD COLUMN     "captura_resolucao_altura" TEXT,
ADD COLUMN     "captura_resolucao_largura" TEXT,
ADD COLUMN     "captura_tamanho" TEXT,
ADD COLUMN     "cliente_status" TEXT;
