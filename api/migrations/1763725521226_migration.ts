exports.up = pgm => {
    pgm.createTable('Organization', {
        id: 'id',
        name: { type: 'text', notNull: true },
        comment: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('Department', {
        id: 'id',
        name: { type: 'text', notNull: true },
        organization_id: {
            type: 'integer',
            notNull: true,
            references: '"Organization"',
            onDelete: 'CASCADE',
        },
        parent_id: {
            type: 'integer',
            references: '"Department"',
            onDelete: 'CASCADE',
        },
        comment: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('Job_title', {
        id: 'id',
        name: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('Role', {
        id: 'id',
        name: { type: 'text', notNull: true },
    });

    pgm.createTable('User', {
        id: 'id',
        role_id: {
            type: 'integer',
            references: '"Role"',
            notNull: true,
        },
        login: { type: 'text', notNull: true },
        password: { type: 'text', notNull: true },
        is_active: { type: 'boolean', default: true, notNull: true },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('Employee', {
        id: 'id',
        first_name: { type: 'text', notNull: true },
        last_name: { type: 'text', notNull: true },
        middle_name: { type: 'text' },
        date_of_birth: { type: 'date', notNull: true },
        passport_data: { type: 'text', notNull: true },
        registration_address: { type: 'text', notNull: true },
        user_id: {
            type: 'integer',
            references: '"User"',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('File', {
        id: 'id',
        name: { type: 'text', notNull: true },
        full_name: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        deleted_at: { type: 'timestamp' },
    });

    pgm.createTable('Passport_scan', {
        id: 'id',
        employee_id: {
            type: 'integer',
            references: '"Employee"',
            notNull: true,
        },
        file_id: {
            type: 'integer',
            references: '"File"',
            notNull: true,
        },
    });

    pgm.createTable('Personnel_operation', {
        id: 'id',
        employee_id: {
            type: 'integer',
            notNull: true,
            references: '"Employee"',
        },
        department_id: {
            type: 'integer',
            notNull: true,
            references: '"Department"',
        },
        job_id: {
            type: 'integer',
            notNull: true,
            references: '"Job_title"',
        },
        salary: { type: 'integer', notNull: true },
        employment_date: { type: 'date', notNull: true },
        dismissal_date: { type: 'date' },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
    });

    pgm.createTable('History', {
        id: 'id',
        operation_object: { type: 'text', notNull: true },
        record_id: { type: 'integer', notNull: true },
        old_values: { type: 'jsonb' },
        new_values: { type: 'jsonb', notNull: true },
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"User"',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
    });
    pgm.createIndex('Department', 'organization_id');
    pgm.createIndex('Department', 'parent_id');
    pgm.createIndex('User', 'role_id');
    pgm.createIndex('Employee', 'user_id');
    pgm.createIndex('Passport_scan', 'employee_id');
    pgm.createIndex('Passport_scan', 'file_id');
    pgm.createIndex('Personnel_operation', 'employee_id');
    pgm.createIndex('Personnel_operation', 'department_id');
    pgm.createIndex('Personnel_operation', 'job_id');
    pgm.createIndex('History', 'user_id');
};

exports.down = pgm => {
    pgm.dropTable('History');
    pgm.dropTable('Passport_scan');
    pgm.dropTable('Personnel_operation');
    pgm.dropTable('File');
    pgm.dropTable('Employee');
    pgm.dropTable('User');
    pgm.dropTable('Role');
    pgm.dropTable('Job_title');
    pgm.dropTable('Department');
    pgm.dropTable('Organization');
};
