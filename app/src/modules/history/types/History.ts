export interface History {
  id: number;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  created_at: string;
  fio: string;
}
