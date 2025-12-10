import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import * as argon2 from 'argon2';
import { Users } from './entity/entity-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private dbService: DbService) {}
    async findAll(): Promise<Users[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT u.id, e.first_name || ' ' || e.last_name as full_name, r.name, login, 
            is_active, u.deleted_at
            FROM "User" u JOIN "Role" r ON u.role_id = r.id
            JOIN "Employee" e ON u.id = e.user_id`,
        );
        return result.rows;
    }
    async findOne(id: number): Promise<Users> {
        const result: QueryResult = await this.dbService.query(
            `SELECT u.id, e.first_name || ' ' || e.last_name as full_name, r.name, login,
            is_active, u.deleted_at, u.created_at, u.updated_at
            FROM "User" u JOIN "Role" r ON u.role_id = r.id
            JOIN "Employee" e ON u.id = e.user_id
            WHERE u.id = $1`,
            [id],
        );
        return result.rows[0];
    }
    async delete(id: number): Promise<Users> {
        const result: QueryResult = await this.dbService.query(
            `UPDATE "User" SET deleted_at = NOW(), is_active = false
            WHERE id = $1 RETURNING *`,
            [id],
        );
        return result.rows[0];
    }
    async create(body: CreateUserDto): Promise<Users> {
        const { role_id, login, password } = body;
        const hashedPassword = await argon2.hash(password);
        const result: QueryResult = await this.dbService.query(
            `INSERT INTO "User" (role_id, login, password) VALUES ($1, $2, $3) RETURNING *`,
            [role_id, login, hashedPassword],
        );
        return result.rows[0];
    }
    async update(id: number, body: UpdateUserDto): Promise<Users> {
        const { role_id, login, password } = body;
        const hashedPassword = await argon2.hash(password!);
        const result: QueryResult = await this.dbService.query(
            `UPDATE "User"  SET role_id = COALESCE($1, role_id), login = COALESCE($2, login),
                   password = COALESCE($3, password) WHERE id = $4 RETURNING *`,
            [role_id, login, hashedPassword, id],
        );
        return result.rows[0];
    }
    async activation(id: number): Promise<Users> {
        const result: QueryResult = await this.dbService.query(
            `UPDATE "User" SET is_active = true WHERE id = $1 RETURNING *`,
            [id],
        );
        return result.rows[0];
    }
    async deactivation(id: number): Promise<Users> {
        const result: QueryResult = await this.dbService.query(
            `UPDATE "User" SET is_active = false WHERE id = $1 RETURNING *`,
            [id],
        );
        return result.rows[0];
    }
}
