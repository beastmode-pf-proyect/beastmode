import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth0Config as config } from './config/auth0.config';
import { auth } from 'express-openid-connect';
import "reflect-metadata"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(auth(config))

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Beast Mode API')
  .setDescription('Esta es una Api construida con Nest JS para ser empleada en las demos del backend de Beast Mode')
  .setVersion('1.0')
  .addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();