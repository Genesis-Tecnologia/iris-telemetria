const axios = require('axios');
const prisma = require('../../prisma/connection.js');
const dayjs = require('../controllers/data.js');

class Notificacao {
    constructor() {
        this.token = process.env.TELEGRAM_TOKEN;
        this.chat_id = process.env.TELEGRAM_CHAT_ID;
        this.url = `https://api.telegram.org/bot${this.token}/sendMessage`;
        this.request = axios;
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
        const { nome_amigavel } = equipamento;

        if (naoEnviando) {
            return this.buildNotSendingMessage(nome_amigavel, minutosSemReceber);
        }

        return this.buildReturnedToSendMessage(nome_amigavel, minutosSemReceber);
    }

    buildNotSendingMessage(nome_amigavel, minutosSemReceber){
        const emoji = this.getEmojis('NAO_ENVIANDO');
        let mensagem = `${emoji} ${nome_amigavel}\n`;

        if (minutosSemReceber <= 59) {
            mensagem += `\u231B ESTÁ A ${minutosSemReceber} MINUTOS SEM ENVIAR TELEMETRIA`;
            return mensagem;
        }

        const horasSemRecber = Math.round(minutosSemReceber /  60);
        if (horasSemRecber < 2) {
            mensagem += `\u231B ESTÁ A ${horasSemRecber} HORA SEM ENVIAR TELEMETRIA`;
        } else {
            mensagem += `\u231B ESTÁ A ${horasSemRecber} HORAS SEM ENVIAR TELEMETRIA`;
        }

        return mensagem;
    }

    buildReturnedToSendMessage(nome_amigavel, minutosSemReceber) {
        const emoji = this.getEmojis('ENVIANDO');
        let message = `${emoji} ${nome_amigavel}\n`;

        if (minutosSemReceber < 59) {
            message += `\u231B ${minutosSemReceber} MINUTOS SEM ENVIAR`;
            return message;
        }

        const horasSemReceber = Math.round(minutosSemReceber / 60);

        if (horasSemReceber < 2) {
            message += `\u231B ${horasSemReceber} HORA SEM ENVIAR`;
            return message;
        }

        message += `\u231B ${horasSemReceber} HORAS SEM ENVIAR`;
        return message;
    }



    async notificar() {
        const equipamentos = await prisma.telemetria_equipamentos.findMany({
            where: { tipo: 'CAMERA' }
        });
        const equipamentosNaoEnviando = equipamentos.filter(equipamento => equipamento.data_hora_ultima_telemetria);
        const turnoAtual = this.getTurnoAtual();
        const campoLatencia = this.getCampoLatencia(turnoAtual);

        for (const equipamento of equipamentos) {
            const ultimoRegistro = await prisma.telemetrias_ocr.findFirst({
                select: { created_at: true, id: true },
                where: { camera_codigo: equipamento.camera_codigo },
                orderBy: { id: 'desc' },
                take: 1
            });

            const latenciaUltimoRegistro = equipamento[campoLatencia];
            let minutosSemEnviar = dayjs().diff(ultimoRegistro.created_at, 'minute');

            await setTimeout(function() {}, 3000);

            if(minutosSemEnviar > latenciaUltimoRegistro) {
                if (equipamento.data_hora_ultima_notificacao === null) {
                    await this.notificarNaoEnviando(equipamento, ultimoRegistro, minutosSemEnviar);
                } else if (dayjs().diff(equipamento.data_hora_ultima_notificacao, 'minute') >= 30) {
                    await this.notificarNaoEnviando(equipamento, ultimoRegistro, minutosSemEnviar);
                }
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
        const data_hora_ultima_notificacao = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'

        await prisma.telemetria_equipamentos.update({
            where: { id: equipamento.id },
            data: { data_hora_ultima_telemetria, data_hora_ultima_notificacao }
        });

        const message = await this.buildMessage(true, equipamento, minutosSemEnviar);
        await this.sendMessage(message);
    }

    async notificarQueVoltouAEnviar(equipamento) {
        let minutosSemEnviar = dayjs().diff(equipamento.data_hora_ultima_telemetria, 'minute');

        await prisma.telemetria_equipamentos.update({
            where: { id: equipamento.id },
            data: { data_hora_ultima_telemetria: null, data_hora_ultima_notificacao: null }
        });

        const message = await this.buildMessage(false, equipamento, minutosSemEnviar);
        await this.sendMessage(message);

    }
}

module.exports = Notificacao