import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth0Config as config } from './config/auth0.config';
import { auth } from 'express-openid-connect';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(auth(config))
  
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
