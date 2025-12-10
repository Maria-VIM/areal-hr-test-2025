exports.up = pgm => {
    pgm.sql(`
        INSERT INTO "Role" (name) VALUES ('Администратор'), ('Менеджер по персоналу')
    `);
};
exports.down = npm => {
    npm.sql('DELETE FROM "Role"');
};

