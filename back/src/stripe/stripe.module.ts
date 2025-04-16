import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { SubscriptionsRepository } from 'src/suscriptions/suscriptions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPlan } from 'src/entities/membership.plan.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { SubscriptionsService } from 'src/suscriptions/suscriptions.service';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/entities/users.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPlan, Subscription, User,]), MailerModule,UsersModule],

  controllers: [StripeController],
  providers: [StripeService, MembershipsRepository, SubscriptionsService, SubscriptionsRepository, UsersService, MembershipsService, UsersRepository],
  exports: [StripeService]
})
export class StripeModule {}
