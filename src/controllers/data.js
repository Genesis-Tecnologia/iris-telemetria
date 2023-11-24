const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);
dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Campo_Grande');

module.exports = dayjs