const express = require('express');
const router = express.Router();
const prisma = require('../prisma/connection.js')
const dayjs = require('./data');

const handleResolutionFromBody = ({ captura_resolucao_altura, captura_resolucao_largura }) => {
  return `${captura_resolucao_altura} x ${captura_resolucao_largura}`;
}

router.post('/ocr', async (req, res) => {
  const { body } = req;

  const captura_resolucao = handleResolutionFromBody(body);

  const telemetria = {  
    ...body,
    captura_data_hora: body.captura_data_hora !== null ? dayjs(body.captura_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.captura_data_hora,
    registro_data_hora: body.registro_data_hora !== null ? dayjs(body.registro_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.registro_data_hora,
    envio_tentativa_data_hora: body.envio_tentativa_data_hora !== null ? dayjs.utc(body.envio_tentativa_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.envio_tentativa_data_hora,
    envio_data_hora: body.envio_data_hora !== null ? dayjs.utc(body.envio_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.envio_data_hora,
    captura_resolucao
  }

  delete telemetria.captura_resolucao_altura
  delete telemetria.captura_resolucao_largura

  let resultado;

  try {
    resultado = await prisma.telemetrias_ocr.create({
      data: telemetria
    });
  } catch (error) {
    return res.status(500).json(error.message)
  }

  resultado.id = parseInt(resultado.id)

  return res.json(resultado);
});

router.put('/ocr/:id', async (req, res) => {
  const { params } = req;
  const { body } = req;
  const { id } = params;

  try {
    const telemetria = await prisma.telemetrias_ocr.update({
      where: { id: parseInt(id) },
      data: body
    });
  } catch (error) {
    return res.status(500).json(erro.message)
  }

  return res.json(telemetria);
});

router.post('/hardware', async (req, res) => {
  const { body } = req;

  let resultado;

  try {
    resultado = await prisma.telemetrias_hardware.create({
      data: body
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }

  resultado.id = parseInt(resultado.id);

  return res.json(resultado);

});

module.exports = router;