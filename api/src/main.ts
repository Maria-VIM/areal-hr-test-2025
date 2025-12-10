import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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
    await app.listen(configService.get('NESTPORT') || 3000);
}
bootstrap();
