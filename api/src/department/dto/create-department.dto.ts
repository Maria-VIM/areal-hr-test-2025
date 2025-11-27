export class CreateDepartmentDto {
    name: string;
    comment: string;
    organization_id: number;
    parent_id: number | null;
}
