exports.up = pgm => {
    pgm.sql(`
        INSERT INTO "Organization" (name, comment) VALUES
        ('Центр Разработки', 'Основной исследовательский и разработческий центр'),
        ('AI Research Lab', 'Лаборатория фундаментальных исследований ИИ'),
        ('FinTech Solutions', 'Разработка финансовых технологий и платежных систем'),
        ('IoT Division', 'Разработка решений для интернета вещей'),
        ('AR/VR Studio', 'Создание приложений дополненной и виртуальной реальности'),
        ('GameDev Unit', 'Разработка игровых приложений и движков'),
        ('Enterprise Systems', 'Корпоративные системы и бизнес-приложения'),
        ('Startup Incubator', 'Инкубатор стартапов и экспериментальных проектов');
    `);
};
exports.down = pgm => {
    pgm.sql(`DELETE FROM "Organization"`);
};
