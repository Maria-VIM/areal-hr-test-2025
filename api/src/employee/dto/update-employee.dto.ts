export class UpdateEmployeeDto {
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: Date;
    passport_data: string;
    registration_address: string;
    user_id?: number | null;
}
