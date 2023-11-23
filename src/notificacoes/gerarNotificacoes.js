// 5 MINUTOS
const tempoDeEsperaDaNotificacaoEmMinutos = process.env.TEMPO_ESPERA_NOTIFICACAO;
const tempoDeEsperaDaNotificacaoEmMilisegundos = tempoDeEsperaDaNotificacaoEmMinutos ? tempoDeEsperaDaNotificacaoEmMinutos * 1000 * 10 : 1000;

const Notificacao = require('./Notificacao.js');

setInterval(async () => {
    const notificacao = new Notificacao();
    await notificacao.notificar();
}, tempoDeEsperaDaNotificacaoEmMilisegundos);