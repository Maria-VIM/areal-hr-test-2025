export interface PersonnelOperation {
    id: number;
    organization: string;
    department: string;
    job: string;
    salary: number;
    employment_date: Date;
    dismissal_date: Date;
    created_at: Date;
    updated_at: Date;
}
