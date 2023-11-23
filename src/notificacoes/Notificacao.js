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

    async notificar() {
        const equipamentos = await prisma.telemetria_equipamentos.findMany();
        await equipamentos.forEach(async equipamento => {
            const ultimoRegistro = await prisma.telemetrias_ocr.findFirst({
                select: { created_at: true },
                where: { camera_codigo: equipamento.camera_codigo },
                orderBy: { id: 'desc' },
                take: 1
            });

            if (dayjs(ultimoRegistro.created_at).subtract(equipamento.latencia, '')) {

            }
        })
    }
}

module.exports = Notificacao