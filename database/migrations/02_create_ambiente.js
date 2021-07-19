exports.up = async(database, utf8 = false) => {
    return database.schema.hasTable('ambiente').then((exists) => {
        if (!exists) {
            return database.schema.createTable('ambiente', table => {
                if (utf8) { table.collate('utf8_unicode_ci'); }

                table.string('id', 50).primary();
                table.string('nome', 80).notNullable();
                table.string('codigo', 80).notNullable();

                table.text('descricao');

                table.integer('deleted').defaultTo(0);
            });
        }
    });
};

exports.down = async(database) => {
    return database.schema.hasTable('ambiente').then((exists) => {
        if (exists) { return database.schema.dropTable('ambiente'); }
    });
};