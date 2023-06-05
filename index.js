import express from 'express';
import prisma from './prisma/connection.js'
import dayjs from 'dayjs';
import cors from 'cors'

const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());

app.post('/telemetrias', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Telemetrias ligadas`)
});