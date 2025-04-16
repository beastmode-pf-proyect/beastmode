import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { WorkoutRoutineModule } from './workout-routine/workout-routine.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrm from './config/typeorm';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { SubscriptionsModule } from './suscriptions/suscriptions.module';
import { ExerciseModule } from './exercise/exercise.module';
import { RoutineExerciseModule } from './routine_exercise/routine_exercise.module';
import { UserWorkoutRoutineModule } from './user_workout_routine/user_workout_routine.module';
import { StripeModule } from './stripe/stripe.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';



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

  UsersModule, SubscriptionsModule, 
  MembershipsModule, WorkoutRoutineModule, 
  TestimonialsModule, FileUploadModule, 
  ExerciseModule, RoutineExerciseModule, RoutineExerciseModule, UserWorkoutRoutineModule, StripeModule, RolesModule
  ],
  controllers: [AppController, RolesController],
  providers: [AppService],
})
export class AppModule {};

