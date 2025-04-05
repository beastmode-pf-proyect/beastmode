import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth0Config as config } from './config/auth0.config';
import { auth } from 'express-openid-connect';
import "reflect-metadata"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(auth(config))

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: ((errors) => {
      const clearError = errors.map((error) => {
        return {property: error.property, constraints: error.constraints}
      })
      return new BadRequestException({
        alert:"Errors has been detected, this are:",
        errors: clearError
      })
    })
  }))

  // app.use(
  //   '/webhooks/stripe',
  //   express.raw({ type: 'application/json' }),
  // );

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Beast Mode API')
  .setDescription('Esta es una Api construida con Nest JS para ser empleada en las demos del backend de Beast Mode')
  .setVersion('1.0')
  .addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: 'http://localhost:3001',   ///PUERTO DE LA APP DE FRONT///// AJUSTAR PARA DEPLOY
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
