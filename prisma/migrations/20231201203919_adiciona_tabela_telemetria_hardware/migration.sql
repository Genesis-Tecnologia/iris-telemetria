-- CreateTable
CREATE TABLE "telemetria_hardware" (
    "id" SERIAL NOT NULL,
    "id_local" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "codigo_equipamento" TEXT NOT NULL,
    "status_cpu" TEXT,
    "status_ram" TEXT,
    "status_disk" TEXT,
    "status_network" TEXT,
    "ping_sefaz" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ultima_telemetria_hardware_id" INTEGER,

    CONSTRAINT "telemetria_hardware_pkey" PRIMARY KEY ("id")
);
