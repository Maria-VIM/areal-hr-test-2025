export class CreateHistoryDto {
    operation_object: string;
    record_id: number;
    old_values: Record<string, any>;
    new_values: Record<string, any>;
    user_id: number;
}
