const express = require('express');
const router = express.Router();
const prisma = require('../../../prisma/connection.js');

router.get('/', async (req, res) => {
    const equipments = await prisma.telemetria_equipamentos.findMany();
    return res.json(equipments);
});

router.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const equipment = await prisma.telemetria_equipamentos.findFirst({
        where: { camera_codigo: codigo }
    });

    return res.json(equipment);

})

module.exports = router;

