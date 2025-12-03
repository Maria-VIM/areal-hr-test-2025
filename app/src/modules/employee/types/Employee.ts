export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  passport_data: string;
  registration_address: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
