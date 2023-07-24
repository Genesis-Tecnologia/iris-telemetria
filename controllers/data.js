const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Campo_Grande');

module.exports = dayjs