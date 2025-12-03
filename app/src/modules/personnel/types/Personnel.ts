export interface PersonnelOperation {
  id: number;
  employee_id: number;
  organization: string;
  organization_id: number;
  department: string;
  department_id: number;
  job: string;
  job_id: number;
  salary: number;
  employment_date: string;
  dismissal_date: string | null;
  created_at: string;
  updated_at: string;
}
