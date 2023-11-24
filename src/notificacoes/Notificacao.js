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

    async buildMessage(equipamento, minutosSemReceber) {
        const { id_localidade, id_sentido_leitura } = equipamento;
        const localidade = await prisma.telemetria_localidades.findFirst({ where: { id: id_localidade } });
        const sentido = await prisma.telemetria_sentido_leitura.findFirst({ where: { id: id_sentido_leitura } });
        let mensagem = `${localidade.localidade} (${sentido.nome}) ESTÁ A `;

        if (minutosSemReceber > 59) {
            const horasSemRecber = Math.round(minutosSemReceber /  60);
            if (horasSemRecber < 2) {
                mensagem += `${horasSemRecber} HORA SEM ENVIAR TELEMETRIA`;
            } else {
                mensagem += `${horasSemRecber} HORAS SEM ENVIAR TELEMETRIA`;
            }

            return mensagem;
        }

        return `${localidade.localidade} (${sentido.nome}) ESTÁ A ${minutosSemReceber} MINUTOS SEM ENVIAR TELEMETRIA`;
    }

    async notificar() {
        const equipamentos = await prisma.telemetria_equipamentos.findMany();
        await equipamentos.forEach(async equipamento => {
            const ultimoRegistro = await prisma.telemetrias_ocr.findFirst({
                select: { created_at: true },
                where: { camera_codigo: equipamento.camera_codigo },
                orderBy: { id: 'desc' },
                take: 1
            });

            const turnoAtual = this.getTurnoAtual();
            const campoLatencia = this.getCampoLatencia(turnoAtual);
            const latenciaUltimoRegistro = equipamento[campoLatencia];
            const minutosSemEnviar = dayjs().diff(ultimoRegistro.created_at, 'minute')
            if(minutosSemEnviar > latenciaUltimoRegistro) {
                const message = await this.buildMessage(equipamento, minutosSemEnviar);
                await this.sendMessage(message);
            }
        });
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
}

module.exports = Notificacao