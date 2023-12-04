/*
  Warnings:

  - You are about to drop the column `ping_sefaz` on the `telemetria_hardware` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telemetria_hardware" RENAME COLUMN "ping_sefaz" TO "ping_equipamento";
