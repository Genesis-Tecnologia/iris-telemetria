const express = require('express');
const router = express.Router();
const prisma = require('../prisma/connection.js')
const dayjs = require('dayjs');

router.post('/', async (req, res) => {
  const { body } = req;

  const telemetria = {
    ...body,
    captura_data_hora: dayjs(body.captura_data_hora).toISOString() || body.captura_data_hora,
    registro_data_hora: dayjs(body.registro_data_hora).toISOString() || body.registro_data_hora,
    envio_tentativa_data_hora: dayjs(body.envio_tentativa_data_hora).toISOString() || body.envio_tentativa_data_hora,
    envio_data_hora: dayjs(body.envio_data_hora).toISOString() || body.envio_data_hora,
  }

  let resultado;

  try {
    resultado = await prisma.telemetrias.create({
      data: telemetria
    });
  } catch (error) {
    return res.status(500).json(error.message)
  }

  resultado.id = parseInt(resultado.id)

  return res.json(resultado)
})

module.exports = router;