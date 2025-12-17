import { HistoryService } from './history.service';
import { logParams } from './entities/entity-log';

const idKeys: {
    Organization: 'id';
    Department: 'id';
    Job_title: 'id';
    Employee: 'id';
    Personnel_operation: 'id';
} = {
    Organization: 'id',
    Department: 'id',
    Job_title: 'id',
    Employee: 'id',
    Personnel_operation: 'id',
};

function processDateChange(key: any, oldVal: any, newVal: any, changes: any) {
    const oldIsNull: boolean = oldVal == null;
    const newIsNull: boolean = newVal == null;
    if (key === 'dismissal_date' && oldIsNull && newIsNull) {
        return;
    }
    const oldDate: string | null =
        oldVal != null
            ? oldVal instanceof Date
                ? oldVal.toISOString().split('T')[0]
                : String(oldVal)
            : null;
    const newDate: string | null =
        newVal != null
            ? newVal instanceof Date
                ? newVal.toISOString().split('T')[0]
                : String(newVal)
            : null;

    if (oldDate === newDate) return;
    changes.push({
        field_name: String(key),
        old_value: oldDate,
        new_value: newDate,
    });
}

export async function logEntityChanges<T extends Record<string, unknown>>(
    history: HistoryService,
    params: logParams<T>,
): Promise<void> {
    const { entity, old_row, new_row } = params;
    const user_id: number = params.user_id != null ? params.user_id : 1;
    const idKey: 'id' = idKeys[entity];
    const entityId: number | undefined =
        (old_row[idKey] as number | undefined) ??
        (new_row[idKey] as number | undefined);
    if (entityId === undefined) {
        console.warn(`Не удалось определить ID для сущности ${entity}`);
        return;
    }
    const skipFields = new Set(['created_at', 'updated_at']);

    const changes: Array<{
        field_name: string;
        old_value: string | null;
        new_value: string | null;
    }> = [];
    for (const key of Object.keys(new_row) as Array<keyof T>) {
        if (skipFields.has(key as string)) continue;

        const oldVal = old_row[key];
        const newVal = new_row[key];
        if (key === 'deleted_at') {
            const oldIsNull: boolean = oldVal == null;
            const newIsNull: boolean = newVal == null;
            if (oldIsNull && newIsNull) continue;
            changes.push({
                field_name: String(key),
                old_value: oldVal != null ? String(oldVal) : null,
                new_value: newVal != null ? String(newVal) : null,
            });
            continue;
        }
        if (
            key === 'dismissal_date' ||
            key === 'date_of_birth' ||
            key === 'employment_date'
        ) {
            processDateChange(key, oldVal, newVal, changes);
            continue;
        }
        if (oldVal === newVal) continue;

        changes.push({
            field_name: String(key),
            old_value: oldVal != null ? String(oldVal) : null,
            new_value: newVal != null ? String(newVal) : null,
        });
    }
    if (changes.length > 0) {
        const oldValues = changes.reduce(
            (acc, change) => {
                if (change.old_value !== null) {
                    acc[change.field_name] = change.old_value;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        const newValues = changes.reduce(
            (acc, change) => {
                if (change.new_value !== null) {
                    acc[change.field_name] = change.new_value;
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        await history.create({
            user_id,
            operation_object: entity,
            record_id: entityId,
            old_values: oldValues,
            new_values: newValues,
        });
    }
}
