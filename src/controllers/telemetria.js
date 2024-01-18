const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/connection.js')
const dayjs = require('./data');

const handleResolutionFromBody = ({ captura_resolucao_altura, captura_resolucao_largura }) => {
  return `${captura_resolucao_altura} x ${captura_resolucao_largura}`;
}

async function handlePublicIp(equipment_code, ip_publico) {
  const equipment = await prisma.telemetria_equipamentos.findFirst({
    where: {
      camera_codigo: equipment_code
    }
  });

  if (equipment.ip_publico !== ip_publico) {
    await prisma.telemetria_equipamentos.update({
      where: {
        camera_codigo: equipment.camera_codigo
      },
      data: {
        ip_publico
      }
    });
  }

}

router.post('/ocr', async (req, res) => {
  const { body } = req;

  const captura_resolucao = handleResolutionFromBody(body);

  const telemetria = {  
    ...body,
    captura_data_hora: body.captura_data_hora !== null ? dayjs(body.captura_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.captura_data_hora,
    registro_data_hora: body.registro_data_hora !== null ? dayjs(body.registro_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.registro_data_hora,
    envio_tentativa_data_hora: body.envio_tentativa_data_hora !== null ? dayjs(body.envio_tentativa_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.envio_tentativa_data_hora,
    envio_data_hora: body.envio_data_hora !== null ? dayjs(body.envio_data_hora).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z' : body.envio_data_hora,
    created_at: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
    captura_resolucao
  }

  delete telemetria.captura_resolucao_altura;
  delete telemetria.captura_resolucao_largura;

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
  const { data } = body;


  if (data.public_ip && ( data.tipo === 'CT' || data.tipo === 'NUC')) {
      await handlePublicIp(data.codigo_equipamento, data.public_ip);
 }

    delete data.public_ip;

  try {
      await prisma.telemetria_hardware.create({
        data: {
          ...data,
          created_at: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
        }
      });
  } catch (error) {
      return res.status(500).json({
        ok: false, message: error.message
      });
  }

  return res.json({ ok: true, message: 'Telemetria enviada com sucesso!' });

});

module.exports = router;