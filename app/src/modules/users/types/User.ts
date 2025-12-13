export interface Users {
  id: number;
  full_name: string;
  role_id: number;
  name: string;
  login: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
