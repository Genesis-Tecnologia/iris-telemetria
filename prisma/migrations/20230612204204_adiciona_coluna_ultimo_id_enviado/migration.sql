/*
  Warnings:

  - Added the required column `ultimo_enviado_id` to the `telemetrias_hardware` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "telemetrias_hardware" ADD COLUMN     "ultimo_enviado_id" INTEGER NOT NULL;
