const path = require('path');

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path.resolve(__dirname, 'database', 'database.sqlite')
        },
        migrations: {
            directory: path.resolve(__dirname, 'database', 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'database', 'seeds')
        },
        useNullAsDefault: true
    },
    production: {
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST ? process.env.DB_HOST : "127.0.0.1",
            user: process.env.DB_USER ? process.env.DB_USER : "root",
            password: process.env.DB_PASS ? process.env.DB_PASS : "",
            database: process.env.DB_BASE ? process.env.DB_BASE : "gerenciador_aplicacoes"
        },
        migrations: {
            directory: path.resolve(__dirname, 'database', 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'database', 'seeds')
        },
        useNullAsDefault: true
    }
};