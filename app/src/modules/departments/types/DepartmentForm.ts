export interface DepartmentForm {
  id?: number;
  name: string;
  organization_id?: number;
  parent_id?: number | null;
  comment: string;
}
