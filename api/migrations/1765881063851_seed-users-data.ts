exports.up = pgm => {
    pgm.sql(`
        INSERT INTO "User" (role_id, login, password) VALUES
            (1, '123', '$argon2id$v=19$m=65536,t=3,p=4$4U8Ez+tsKVGuKj4SuLrAwA$Aoxl7rHBFk6k02n0oCp86QxabN3dwaAd/IHjYI53F2c'),
            (2, '123123', '$argon2id$v=19$m=65536,t=3,p=4$DwufgR4UIsynaYiM4PLAAg$2sv+RySWdfdd10y0+NnfvxqDKYz6qFfkABF3js8SjIg')
    `);
};
exports.down = pgm => {
    pgm.sql(`DELETE FROM "User"`);
};
