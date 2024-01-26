const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const helmet = require('helmet');
const telemtrias = require('./src/controllers/telemetria.js');
const equipments = require('./src/controllers/api/equipments.js');

const port = 8002;
const app = express();
app.use(express.json());
app.use(cors({
  allowOrigin: ['localhost', '192.168.100.40']
}));
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/telemetrias', telemtrias);

app.use('/api/equipments', equipments)

app.listen(port, () => {
  console.log(`Telemetrias ligadas`);
});
