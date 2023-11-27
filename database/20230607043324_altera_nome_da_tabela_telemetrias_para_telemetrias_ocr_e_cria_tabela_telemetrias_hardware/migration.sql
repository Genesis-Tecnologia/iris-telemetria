/*
  Warnings:

  - You are about to drop the `telemetrias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "telemetrias";

-- CreateTable
CREATE TABLE "telemetrias_ocr" (
    "id" BIGSERIAL NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "captura_data_hora" TIMESTAMPTZ(6),
    "registro_data_hora" TIMESTAMPTZ(6),
    "envio_tentativa_data_hora" TIMESTAMPTZ(6),
    "envio_data_hora" TIMESTAMPTZ(6),
    "placa" VARCHAR(255),
    "placa_tipo" VARCHAR(25),
    "placa_totalmente_reconhecida" BOOLEAN,
    "sentido" VARCHAR(255),
    "camera_nome" VARCHAR(255),
    "camera_codigo" VARCHAR(255),
    "veiculo_tipo" VARCHAR(50),
    "veiculo_cor" VARCHAR(50),
    "velocidade" VARCHAR(50),
    "faixa" VARCHAR(10),
    "ultimo_enviado_id" INTEGER NOT NULL,
    "arquivo_nome" VARCHAR(255),
    "camera_latitude" VARCHAR(255),
    "camera_longitude" VARCHAR(255),
    "camera_endereco" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_telemetria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetrias_hardware" (
    "id" BIGSERIAL NOT NULL,
    "camera_codigo" TEXT,
    "status_cpu" TEXT,
    "status_ram" TEXT,
    "status_disco" TEXT,
    "status_rede" TEXT,
    "ping_sefaz" TEXT,
    "ping_camera" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetrias_hardware_pkey" PRIMARY KEY ("id")
);
