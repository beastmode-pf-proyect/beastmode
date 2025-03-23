import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SuscriptionsModule } from './suscriptions/suscriptions.module';
import { MembershipsModule } from './memberships/memberships.module';
import { PaymentModule } from './payment/payment.module';
import { WorkoutRoutineModule } from './workout-routine/workout-routine.module';

@Module({
  imports: [UsersModule, SuscriptionsModule, MembershipsModule, PaymentModule, WorkoutRoutineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
