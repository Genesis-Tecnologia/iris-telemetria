const express = require('express');
const cors = require('cors');
const compression = require('compression')
const path = require('path')
const helmet = require('helmet');
const telemtrias = require('./controllers/telemetria.js')

const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet);
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/telemetrias', telemtrias);

app.listen(port, () => {
  console.log(`Telemetrias ligadas`)
});