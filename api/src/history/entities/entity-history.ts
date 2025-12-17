export interface history {
    id: number;
    operation_object: string;
    record_id: number;
    old_values: string;
    new_values: string;
    user_id: number;
    created_at: Date;
    fio?: string;
}
