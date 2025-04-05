import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { WorkoutRoutineModule } from './workout-routine/workout-routine.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { SubscriptionsModule } from './suscriptions/suscriptions.module';
import { ExerciseModule } from './exercise/exercise.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [typeOrm],
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    // eslint-disable-next-line @typescript-eslint/require-await
    useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
      const typeOrmConfig = config.get<TypeOrmModuleOptions>('typeorm');
      if (!typeOrmConfig) {
        throw new Error('TypeORM configuration is not defined in the environment.');
      }
      return typeOrmConfig;
    },
  }),
  JwtModule.register({
    global: true,
    signOptions: {
      expiresIn: '1h',
      },
    secret: process.env.JWT_SECRET,
  }),
  UsersModule, SubscriptionsModule, MembershipsModule, WorkoutRoutineModule, AuthModule, TestimonialsModule, FileUploadModule, ExerciseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {};

