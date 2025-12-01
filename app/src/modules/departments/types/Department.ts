export interface Department {
  id: number;
  name: string;
  organization_id: number;
  parent_id: number | null;
  children?: Department[];
  comment?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
