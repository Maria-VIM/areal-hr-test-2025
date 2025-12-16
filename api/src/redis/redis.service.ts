import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    public client: RedisClientType;
    public redisStore: RedisStore;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        try {
            this.client = createClient({
                url:
                    this.configService.get<string>('REDIS') ||
                    'redis://localhost:6379',
                socket: {
                    reconnectStrategy: retries => {
                        if (retries > 10) {
                            console.error(
                                'Max Redis reconnection attempts reached',
                            );
                            return new Error('Max retries reached');
                        }
                        return Math.min(retries * 100, 3000);
                    },
                },
            });
            await this.client.connect();

            import('express-session')
                .then(() => {
                    this.redisStore = new RedisStore({
                        client: this.client,
                        prefix: 'session:',
                    });
                })
                .catch(error => {
                    console.error('Failed to import express-session:', error);
                });

            console.log('Redis service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Redis:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        if (this.client && this.client.isOpen) {
            await this.client.quit();
            console.log('Redis connection closed');
        }
    }

    getStore() {
        return this.redisStore;
    }
}
