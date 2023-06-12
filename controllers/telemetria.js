const express = require('express');
const router = express.Router();
const prisma = require('../prisma/connection.js')
const dayjs = require('dayjs');

router.post('/ocr', async (req, res) => {
  const { body } = req;

  const telemetria = {  
    ...body,
    captura_data_hora: body.captura_data_hora !== null ? dayjs(body.captura_data_hora).toISOString() : body.captura_data_hora,
    registro_data_hora: body.registro_data_hora !== null ? dayjs(body.registro_data_hora).toISOString() : body.registro_data_hora,
    envio_tentativa_data_hora: body.envio_tentativa_data_hora !== null ? dayjs(body.envio_tentativa_data_hora).toISOString() : body.envio_tentativa_data_hora,
    envio_data_hora: body.envio_data_hora !== null ? dayjs(body.envio_data_hora).toISOString() : body.envio_data_hora,
  }

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