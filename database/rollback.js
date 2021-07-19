require('dotenv').config();

const fs = require('fs');
const path = require('path');
const knex = require('./connection');

const rollback = async() => {
    if (!['', null, undefined].includes(process.env.DB_BASE)) {
        await knex.raw(`DROP DATABASE IF EXISTS ${process.env.DB_BASE}`).catch(e => console.log(e));
    } else {
        fs.unlinkSync(path.join(__dirname, 'database.sqlite'));
    }

    console.log('Database droped successfully');
    process.exit();
};

rollback();