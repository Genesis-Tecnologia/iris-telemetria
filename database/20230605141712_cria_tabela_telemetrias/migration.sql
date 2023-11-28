-- CreateTable
CREATE TABLE "telemetrias" (
    "id" BIGSERIAL NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "captura_data_hora" TIMESTAMPTZ(6) NOT NULL,
    "registro_data_hora" TIMESTAMPTZ(6) NOT NULL,
    "envio_tentativa_data_hora" TIMESTAMPTZ(6) NOT NULL,
    "envio_data_hora" TIMESTAMPTZ(6) NOT NULL,
    "placa" VARCHAR(255) NOT NULL,
    "placa_tipo" VARCHAR(25) NOT NULL,
    "placa_totalmente_reconhecida" BOOLEAN NOT NULL,
    "sentido" VARCHAR(255) NOT NULL,
    "camera_nome" VARCHAR(255) NOT NULL,
    "camera_codigo" VARCHAR(255) NOT NULL,
    "veiculo_tipo" VARCHAR(50) NOT NULL,
    "veiculo_cor" VARCHAR(50) NOT NULL,
    "velocidade" VARCHAR(50) NOT NULL,
    "faixa" VARCHAR(10) NOT NULL,
    "ultimo_enviado_id" INTEGER NOT NULL,
    "arquivo_nome" VARCHAR(255) NOT NULL,
    "status_cpu" TEXT NOT NULL,
    "status_ram" TEXT NOT NULL,
    "status_disco" TEXT NOT NULL,
    "status_rede" TEXT NOT NULL,
    "ping_sefaz" BOOLEAN NOT NULL,
    "ping_camera" BOOLEAN NOT NULL,
    "camera_latitude" VARCHAR(255) NOT NULL,
    "camera_longitude" VARCHAR(255) NOT NULL,
    "camera_endereco" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_telemetria_pkey" PRIMARY KEY ("id")
);