exports.up = async(database, utf8 = false) => {
    return database.schema.hasTable('status_feature').then((exists) => {
        if (!exists) {
            return database.schema.createTable('status_feature', table => {
                if (utf8) { table.collate('utf8_unicode_ci'); }

                table.string('id', 80).notNullable();
                table.string('feature', 45).notNullable();
                table.string('ambiente', 45).notNullable();
                table.string('alvo', 80);
                table.integer('status').defaultTo(1);

                table.integer('deleted').defaultTo(0);

                table.foreign('feature').references('id').inTable('feature');
                table.foreign('ambiente').references('id').inTable('ambiente');
            });
        }
    });
};

exports.down = async(database) => {
    return database.schema.hasTable('ambiente').then((exists) => {
        if (exists) { return database.schema.dropTable('status_feature'); }
    });
};