export interface Organization {
  id: number;
  name: string;
  comment: string;
  deleted_at: string | null;
  created_at: string;
  updated_at?: string;
}
