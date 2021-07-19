require('dotenv').config();
const knex = require('knex');
const connection = require('../knexfile');
module.exports = knex(connection[!['', null, undefined].includes(process.env.DB_HOST) ? 'production' : 'development']);