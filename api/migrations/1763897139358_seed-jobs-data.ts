exports.up = pgm => {
    pgm.sql(`
        INSERT INTO "Job_title" (name) VALUES
        ('Software Engineer'),
        ('Senior Software Engineer'),
        ('Lead Software Engineer'),
        ('Frontend Developer'),
        ('Backend Developer'),
        ('Full Stack Developer'),
        ('DevOps Engineer'),
        ('Data Scientist'),
        ('Machine Learning Engineer'),
        ('Data Engineer'),
        ('Data Analyst'),
        ('QA Engineer'),
        ('Senior QA Engineer'),
        ('Test Automation Engineer'),
        ('System Administrator'),
        ('Network Engineer'),
        ('Security Engineer'),
        ('Product Manager'),
        ('Project Manager'),
        ('Scrum Master'),
        ('Business Analyst'),
        ('UI/UX Designer'),
        ('Graphic Designer'),
        ('Technical Writer'),
        ('Solution Architect'),
        ('Team Lead'),
        ('Engineering Manager'),
        ('CTO'),
        ('CEO'),
        ('HR Manager'),
        ('Recruiter'),
        ('Marketing Manager')
    `);
};

exports.down = pgm => {
    pgm.sql(`DELETE FROM "Job_title"`);
};
