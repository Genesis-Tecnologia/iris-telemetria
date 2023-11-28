const axios = require('axios');
const prisma = require('../../prisma/connection.js');
const dayjs = require('../controllers/data.js');

class Notificacao {
    constructor() {
        this.token = '6622635038:AAGripB9ZNBr7gqw1dH6DVaq2wUgykyRUOg';
        this.url = `https://api.telegram.org/bot${this.token}/sendMessage`;
        this.request = axios;
        this.chat_id = -4037863483;
    }

    getEmojis(emoji) {
        const emojis = {
            'NAO_ENVIANDO': '\u274c',
            'ENVIANDO': '\u2705'
        }

        return emojis[emoji];
    }

    async sendMessage(text) {
        let response;

        try {
            response = await this.request.post(this.url, {
                text, chat_id: this.chat_id
            });
        } catch (error) {
            console.log(`(TELEMETRIA) FALHA AO ENVIAR NOTIFICAÇÃO\n(TELEMETRIA) ${error.message}`);
            return null;
        }

        return response;
    }

    async buildMessage(naoEnviando, equipamento, minutosSemReceber) {
        const { id_localidade, id_sentido_leitura } = equipamento;
        const localidade = await prisma.telemetria_localidades.findFirst({ where: { id: id_localidade } });
        const sentido = await prisma.telemetria_sentido_leitura.findFirst({ where: { id: id_sentido_leitura } });

        if (naoEnviando) {
            return this.buildNotSendingMessage(localidade, sentido, minutosSemReceber);
        }

        return this.buildReturnedToSendMessage(localidade, sentido, minutosSemReceber);
    }

    buildNotSendingMessage(localidade, sentido, minutosSemReceber){
        const emoji = this.getEmojis('NAO_ENVIANDO');
        let mensagem = `${emoji} ${localidade.localidade} (${sentido.nome}) ESTÁ A `;

        if (minutosSemReceber <= 59) {
            return `${localidade.localidade} (${sentido.nome}) ESTÁ A ${minutosSemReceber} MINUTOS SEM ENVIAR TELEMETRIA`;
        }

        const horasSemRecber = Math.round(minutosSemReceber /  60);
        if (horasSemRecber < 2) {
            mensagem += `${horasSemRecber} HORA SEM ENVIAR TELEMETRIA`;
        } else {
            mensagem += `${horasSemRecber} HORAS SEM ENVIAR TELEMETRIA`;
        }

        return mensagem;
    }

    buildReturnedToSendMessage(localidade, sentido, minutosSemReceber) {
        const emoji = this.getEmojis('ENVIANDO');
        let message = `${emoji} ${localidade.localidade} (${sentido.nome})`;

        if (minutosSemReceber < 59) {
            message += ` - ${minutosSemReceber} MINUTOS SEM ENVIAR`;
            return message;
        }

        const horasSemReceber = Math.round(minutosSemReceber / 60);

        if (horasSemReceber < 2) {
            message += ` - ${horasSemReceber} HORA SEM ENVIAR`;
            return message;
        }

        message += ` - ${horasSemReceber} HORAS SEM ENVIAR`;
        return message;
    }



    async notificar() {
        const equipamentos = await prisma.telemetria_equipamentos.findMany();
        const equipamentosNaoEnviando = equipamentos.filter(equipamento => equipamento.data_hora_ultima_telemetria);

        for (const equipamento of equipamentos) {
            const ultimoRegistro = await prisma.telemetrias_ocr.findFirst({
                select: { created_at: true, id: true },
                where: { camera_codigo: equipamento.camera_codigo },
                orderBy: { id: 'desc' },
                take: 1
            });

            const turnoAtual = this.getTurnoAtual();
            const campoLatencia = this.getCampoLatencia(turnoAtual);
            const latenciaUltimoRegistro = equipamento[campoLatencia];
            let minutosSemEnviar = dayjs().diff(ultimoRegistro.created_at, 'minute');

            await setTimeout(function() {}, 2000);

            if(minutosSemEnviar > latenciaUltimoRegistro) {
                await this.notificarNaoEnviando(equipamento, ultimoRegistro, minutosSemEnviar);

            } else if(equipamentosNaoEnviando.length > 0) {
                const equipamentoNaoEnviando = equipamentosNaoEnviando.filter(equipamentoNaoEnviando => {
                    return equipamentoNaoEnviando.id === equipamento.id && equipamentoNaoEnviando.data_hora_ultima_telemetria !== null;
                })[0];

                if (equipamentoNaoEnviando) {
                    await this.notificarQueVoltouAEnviar(equipamentoNaoEnviando)
                }
            }
        }
    }

    getTurnoAtual() {
        const diaAtual = dayjs().format('YYYY-MM-DD');
        let manha = `${diaAtual} 05:20:00`;
        let tarde = `${diaAtual} 12:00:00`;
        let noite = `${diaAtual} 17:40:00`;

        const ehManha = dayjs().isBetween(manha, tarde, 'hour');
        if (ehManha) {
            return 'MANHA';
        }

        const ehTarde = dayjs().isBetween(tarde, noite);
        if (ehTarde) {
            return 'TARDE';
        }

        return 'NOITE';
    }

    getCampoLatencia(turnoAtual) {
        switch (turnoAtual) {
            case 'MANHA':
                return  'latencia_captura_manha';

            case 'TARDE':
                return 'latencia_captura_tarde';

            default:
                return 'latencia_captura_noite'

        }
    }

    async notificarNaoEnviando(equipamento, ultimoRegistro, minutosSemEnviar) {
        const data_hora_ultima_telemetria = dayjs(ultimoRegistro.created_at).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';

        await prisma.telemetria_equipamentos.update({
            where: { id: equipamento.id },
            data: { data_hora_ultima_telemetria }
        });

        const message = await this.buildMessage(true, equipamento, minutosSemEnviar);
        await this.sendMessage(message);
    }

    async notificarQueVoltouAEnviar(equipamento) {
        let minutosSemEnviar = dayjs().diff(equipamento.data_hora_ultima_telemetria, 'minute');

        await prisma.telemetria_equipamentos.update({
            where: { id: equipamento.id },
            data: { data_hora_ultima_telemetria: null }
        });

        const message = await this.buildMessage(false, equipamento, minutosSemEnviar);
        await this.sendMessage(message);

    }
}

module.exports = Notificacao