import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import { RedisService } from './redis/redis.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const config = new DocumentBuilder()
        .setTitle('Web-app')
        .setDescription('Web-app for hr and admins')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    app.enableCors({
        origin: configService.get<string>('ORIGIN') || 'http://localhost:8000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const redisService = app.get(RedisService);
    const redisStore = redisService.getStore();
    app.use(
        session({
            store: redisStore,
            secret: configService.get('SECRET') || 'oops I did it again',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 180 * 60,
            },
        }),
    );
    await app.listen(configService.get('NESTPORT') || 3000);
}
bootstrap();
