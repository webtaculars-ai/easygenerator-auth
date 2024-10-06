import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.BASE_URL || 'http://localhost:3001',
    credentials: true,
  });
  console.log('called', process.env.NODE_ENV);

  if (process.env.NODE_ENV !== 'production') {
    console.log('called', process.env.NODE_ENV);
    const config = new DocumentBuilder()
      .setTitle('Easy Generator Authentication API')
      .setDescription('API for user signup, login, and profile management')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
