export interface logParams<T extends Record<string, unknown>> {
    entity:
        | 'Organization'
        | 'Department'
        | 'Job_title'
        | 'Employee'
        | 'Personnel_operation';
    old_row: T;
    new_row: T;
    user_id?: number;
}
