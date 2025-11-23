import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    public pool: Pool;
    constructor(configService: ConfigService) {
        this.pool = new Pool({
            host: configService.get('PGHOST', 'localhost'),
            port: configService.get('PGPORT', 5432),
            user: configService.get('PGUSER', 'postgres'),
            password: configService.get('PGPASSWORD', 'postgres'),
            database: configService.get('PGDATABASE', 'postgres'),
        });
    }
    async onModuleInit(): Promise<void> {
        try {
            const client: PoolClient = await this.pool.connect();
            client.release();
            console.log('Connected!');
        } catch (error) {
            console.log(error);
        }
    }
    async onModuleDestroy(): Promise<void> {
        await this.pool.end();
    }
    async query(text: string, params?: any[]): Promise<QueryResult> {
        return this.pool.query(text, params);
    }
}
