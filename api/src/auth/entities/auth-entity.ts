export interface AuthUser {
    id: number;
    role_id: number;
    login: string;
    password: string;
    is_active: boolean;
    deleted_at: Date;
}
