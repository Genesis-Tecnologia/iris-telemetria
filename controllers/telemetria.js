const express = require('express');
const router = express.Router();
const prisma = require('../prisma/connection.js')
const dayjs = require('dayjs');

router.post('/', async (req, res) => {
  const { body } = req;

  const telemetria = {
    ...body,
    captura_data_hora: dayjs(body.captura_data_hora).toISOString(),
    registro_data_hora: dayjs(body.registro_data_hora).toISOString(),
    envio_tentativa_data_hora: dayjs(body.registro_data_hora).toISOString(),
    envio_data_hora: dayjs(body.registro_data_hora).toISOString(),
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