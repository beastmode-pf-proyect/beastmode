import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const clearError = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException({
          alert: 'Errors have been detected, these are:',
          errors: clearError,
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Beast Mode API')
    .setDescription(
      'Esta es una API construida con NestJS para ser empleada en las demos del backend de Beast Mode',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // 🛡️ CORS personalizado: acepta .vercel.app y localhost:3001
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin || // Permite Postman, cURL y servicios internos
        origin.endsWith('.vercel.app') ||
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:3001' ||
        origin.endsWith('.onrender.com')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS.'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs')

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
