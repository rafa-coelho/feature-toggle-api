exports.up = async(database, utf8 = false) => {
    return database.schema.hasTable('feature').then((exists) => {
        if (!exists) {
            return database.schema.createTable('feature', table => {
                if (utf8) { table.collate('utf8_unicode_ci'); }

                table.string('id', 80).notNullable();
                table.string('titulo', 80).notNullable();
                table.string('nome', 80).notNullable();

                table.text('descricao');

                table.integer('deleted').defaultTo(0);
            });
        }
    });
};

exports.down = async(database) => {
    return database.schema.hasTable('feature').then((exists) => {
        if (exists) { return database.schema.dropTable('feature'); }
    });
};