import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeOrm from './config/typeorm';
import { UsersModule } from './users/users.module';
import { SuscriptionsModule } from './suscriptions/suscriptions.module';
import { MembershipsModule } from './memberships/memberships.module';
import { PaymentModule } from './payment/payment.module';
import { WorkoutRoutineModule } from './workout-routine/workout-routine.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


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
  UsersModule,
  SuscriptionsModule, 
  MembershipsModule, 
  PaymentModule, 
  WorkoutRoutineModule  
  ],
  controllers: [AppController],
  providers: [AppService],

export class AppModule {}
