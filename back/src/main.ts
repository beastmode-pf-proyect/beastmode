import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Beast Mode API')
  .setDescription('Esta es una Api construida con Nest JS para ser empleada en las demos del backend de Beast Mode')
  .setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: ['http://localhost:3001', 'https://beastmode-diph.vercel.app'],   ///PUERTO DE LA APP DE FRONT///// AJUSTAR PARA DEPLOY
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
