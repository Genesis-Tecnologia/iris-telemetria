-- CreateTable
CREATE TABLE "telemetrias_ocr" (
    "id" BIGSERIAL NOT NULL,
    "tipo" VARCHAR(10),
    "captura_data_hora" TIMESTAMPTZ(6),
    "registro_data_hora" TIMESTAMPTZ(6),
    "envio_tentativa_data_hora" TIMESTAMPTZ(6),
    "envio_data_hora" TIMESTAMPTZ(6),
    "placa" VARCHAR(255),
    "placa_tipo" VARCHAR(25),
    "placa_totalmente_reconhecida" BOOLEAN,
    "sentido" VARCHAR(255),
    "camera_codigo" VARCHAR(255),
    "veiculo_tipo" VARCHAR(50),
    "veiculo_cor" VARCHAR(50),
    "velocidade" VARCHAR(50),
    "faixa" VARCHAR(10),
    "ultimo_enviado_id" INTEGER,
    "arquivo_nome" VARCHAR(255),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "captura_tamanho" TEXT,
    "cliente_status" TEXT,
    "captura_resolucao" TEXT,
    "t_registro_data_hora" TIMESTAMPTZ(6),
    "t_envio_tentativa_data_hora" TIMESTAMPTZ(6),
    "t_deletado_duplicado" BOOLEAN,
    "t_registro_data_hora_fake" BOOLEAN,
    "t_envio_tentativa_data_hora_fake" BOOLEAN,

    CONSTRAINT "api_telemetria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fr_grupo" (
    "grp_codigo" INTEGER NOT NULL,
    "sis_codigo" VARCHAR(3) NOT NULL,
    "grp_nome" VARCHAR(40) NOT NULL,
    "grp_filtro_dicionario" VARCHAR(2000),

    CONSTRAINT "fr_grupo_pkey" PRIMARY KEY ("grp_codigo","sis_codigo")
);

-- CreateTable
CREATE TABLE "fr_log" (
    "log" VARCHAR(6000)
);

-- CreateTable
CREATE TABLE "fr_log_event" (
    "log_id" INTEGER NOT NULL,
    "log_data" TIMESTAMP(6),
    "log_hora" VARCHAR(8),
    "log_codform" INTEGER,
    "log_descform" VARCHAR(100),
    "log_operacao" VARCHAR(1),
    "log_usuario" VARCHAR(30),
    "log_sistema" VARCHAR(3),
    "log_chave" VARCHAR(200),
    "log_chavecont" VARCHAR(128),
    "log_conteudo" TEXT,
    "log_ip" CHAR(20),

    CONSTRAINT "fr_log_event_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "fr_permissao" (
    "per_codigo" INTEGER NOT NULL,
    "grp_codigo" INTEGER NOT NULL,
    "sis_codigo" VARCHAR(3) NOT NULL,
    "rel_codigo" INTEGER,
    "frm_codigo" INTEGER,
    "com_codigo" INTEGER,
    "mnu_codigo" INTEGER,
    "per_adicionar" VARCHAR(1) NOT NULL DEFAULT 'N',
    "per_excluir" VARCHAR(1) NOT NULL DEFAULT 'N',
    "per_editar" VARCHAR(1) NOT NULL DEFAULT 'N',
    "per_visualizar" VARCHAR(1) NOT NULL DEFAULT 'N',
    "per_habilitado" VARCHAR(1) NOT NULL DEFAULT 'N',

    CONSTRAINT "fr_permissao_pkey" PRIMARY KEY ("per_codigo")
);

-- CreateTable
CREATE TABLE "fr_regras" (
    "reg_cod" INTEGER NOT NULL,
    "reg_nome" VARCHAR(255),
    "reg_descricao" TEXT,
    "reg_params" TEXT,
    "reg_variaveis" TEXT,
    "reg_params_out" TEXT,
    "reg_interface" TEXT,
    "reg_script" TEXT,
    "reg_data" TIMESTAMP(6),
    "reg_hora" TIMESTAMP(6),
    "reg_compilada" VARCHAR(1),
    "reg_destino" INTEGER,
    "reg_hash" VARCHAR(50),
    "cat_cod" INTEGER DEFAULT 1,
    "usr_codigo" INTEGER,

    CONSTRAINT "fr_regras_pkey" PRIMARY KEY ("reg_cod")
);

-- CreateTable
CREATE TABLE "fr_sessao" (
    "ses_conexao" INTEGER NOT NULL,
    "ses_datahora_login" TIMESTAMP(6),
    "ses_usuario" VARCHAR(20),
    "ses_nome_usuario" VARCHAR(40),
    "ses_nome_maquina" VARCHAR(40),
    "ses_end_ip" VARCHAR(20),
    "sis_codigo" VARCHAR(3),

    CONSTRAINT "fr_sessao_pkey" PRIMARY KEY ("ses_conexao")
);

-- CreateTable
CREATE TABLE "fr_sistema" (
    "sis_codigo" VARCHAR(3) NOT NULL,
    "sis_descricao" VARCHAR(30) NOT NULL,
    "img_codigo" INTEGER,
    "img_codigo_icone" INTEGER,
    "sis_sqldatalimite" VARCHAR(2000),
    "sis_sqldadosentidade" VARCHAR(2000),
    "sis_sqlinformacoes" VARCHAR(2000),
    "sis_check" VARCHAR(30),
    "sis_acessoexterno" BOOLEAN,
    "sis_grupoexterno" INTEGER,
    "sis_informacao" VARCHAR(2000),
    "sis_resumo" VARCHAR(1000),
    "sis_unique_identifier" CHAR(36),

    CONSTRAINT "fr_sistema_pkey" PRIMARY KEY ("sis_codigo")
);

-- CreateTable
CREATE TABLE "fr_tarefa" (
    "trf_codigo" INTEGER NOT NULL,
    "trf_descricao" VARCHAR(255) NOT NULL,
    "sis_codigo" VARCHAR(3) NOT NULL,
    "reg_codigo" INTEGER NOT NULL,
    "trf_data_inicial" TIMESTAMP(6),
    "trf_data_final" TIMESTAMP(6),
    "trf_ativa" VARCHAR(1) NOT NULL,
    "trf_regra_parametros" TEXT,
    "trf_tipo_agendamento" VARCHAR(15),

    CONSTRAINT "fr_tarefa_pkey" PRIMARY KEY ("trf_codigo")
);

-- CreateTable
CREATE TABLE "fr_tarefa_tempo" (
    "trt_codigo" INTEGER NOT NULL,
    "trf_codigo" INTEGER NOT NULL,
    "trt_tipo" VARCHAR(15) NOT NULL,
    "trt_valor" INTEGER NOT NULL,

    CONSTRAINT "fr_tarefa_tempo_pkey" PRIMARY KEY ("trt_codigo")
);

-- CreateTable
CREATE TABLE "fr_usuario" (
    "usr_codigo" INTEGER NOT NULL,
    "usr_login" VARCHAR(20) NOT NULL,
    "usr_senha" VARCHAR(64),
    "usr_administrador" VARCHAR(1) NOT NULL DEFAULT 'N',
    "usr_tipo_expiracao" VARCHAR(1) NOT NULL DEFAULT 'N',
    "usr_dias_expiracao" INTEGER,
    "usr_imagem_digital" BYTEA,
    "usr_foto" BYTEA,
    "usr_nome" VARCHAR(60) NOT NULL,
    "usr_email" VARCHAR(120),
    "usr_digital" BIGINT,
    "usr_inicio_expiracao" TIMESTAMP(6),

    CONSTRAINT "fr_usuario_pkey" PRIMARY KEY ("usr_codigo")
);

-- CreateTable
CREATE TABLE "fr_usuario_grupo" (
    "grp_codigo" INTEGER NOT NULL,
    "sis_codigo" VARCHAR(3) NOT NULL,
    "usr_codigo" INTEGER NOT NULL,

    CONSTRAINT "fr_usuario_grupo_pkey" PRIMARY KEY ("grp_codigo","sis_codigo","usr_codigo")
);

-- CreateTable
CREATE TABLE "fr_usuario_sistema" (
    "usr_codigo" INTEGER NOT NULL,
    "sis_codigo" VARCHAR(3) NOT NULL,
    "uss_acesso_externo" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_administrador" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_acesso_maker" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_criar_formulario" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_criar_relatorio" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_acessar" VARCHAR(1) NOT NULL DEFAULT 'N',
    "uss_criar_regra" VARCHAR(1) NOT NULL DEFAULT 'N',

    CONSTRAINT "fr_usuario_sistema_pkey" PRIMARY KEY ("usr_codigo","sis_codigo")
);

-- CreateTable
CREATE TABLE "script" (
    "script" TEXT
);

-- CreateTable
CREATE TABLE "telemetria_equipamentos" (
    "id" SERIAL NOT NULL,
    "id_localidade" INTEGER,
    "id_sentido_leitura" INTEGER,
    "endereco" VARCHAR,
    "longitude" VARCHAR,
    "latitude" VARCHAR,
    "camera_codigo" VARCHAR(15),
    "id_tipo_internet" INTEGER,
    "id_tipo_energia" INTEGER,
    "id_local_instalado" INTEGER,
    "tamanho_imagem" INTEGER,
    "resolucao_imagem" VARCHAR,
    "latencia_captura_manha" INTEGER,
    "latencia_captura_tarde" INTEGER,
    "latencia_captura_noite" INTEGER
);

-- CreateTable
CREATE TABLE "telemetria_local_instalado" (
    "id" SERIAL NOT NULL,
    "local" VARCHAR,
    "latencia_recebimento_max" TIME(6),
    "latencia_leitura_max" TIME(6),
    "tamanho_imagem" INTEGER,
    "resolucao_imagem" INTEGER,

    CONSTRAINT "telemetria_local_instalado_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetria_localidades" (
    "localidade" VARCHAR,
    "uf" VARCHAR(2),
    "id" SERIAL NOT NULL
);

-- CreateTable
CREATE TABLE "telemetria_sentido_leitura" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR,

    CONSTRAINT "telemetria_sentido_leitura_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetria_tipo_energia" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR,

    CONSTRAINT "telemetria_tipo_energia_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetria_tipo_internet" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR,
    "velocidade_link" INTEGER
);

-- CreateIndex
CREATE INDEX "telemetrias_ocr_camera_codigo_idx" ON "telemetrias_ocr"("camera_codigo");

-- CreateIndex
CREATE INDEX "telemetrias_ocr_captura_data_hora_idx" ON "telemetrias_ocr"("captura_data_hora", "camera_codigo");

-- CreateIndex
CREATE INDEX "telemetrias_ocr_placa_idx" ON "telemetrias_ocr"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "fr_usuario_fr_login_idx" ON "fr_usuario"("usr_login");

-- CreateIndex
CREATE UNIQUE INDEX "telemetrias_equipamentos_id_idx" ON "telemetria_equipamentos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "telemetrias_equipamentos_camera_codigo_idx" ON "telemetria_equipamentos"("camera_codigo");

-- CreateIndex
CREATE INDEX "telemetria_local_instalado_id_idx" ON "telemetria_local_instalado"("id");

-- CreateIndex
CREATE UNIQUE INDEX "telemetria_localidades_id_idx" ON "telemetria_localidades"("id");

-- CreateIndex
CREATE INDEX "telemetria_sentido_leitura_id_idx" ON "telemetria_sentido_leitura"("id");

-- CreateIndex
CREATE UNIQUE INDEX "telemetria_tipo_energia_un" ON "telemetria_tipo_energia"("id");

-- CreateIndex
CREATE INDEX "telemetria_tipo_energia_id_idx" ON "telemetria_tipo_energia"("id");

