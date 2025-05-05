import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionsRepository } from "./suscriptions.repository";
import { SubscriptionsService } from "./suscriptions.service";
import { SubscriptionsController } from "./suscriptions.controller";
import { StripeModule } from "src/stripe/stripe.module";
import { MembershipsModule } from "src/memberships/memberships.module";
import { UsersModule } from "src/users/users.module";
import { MailerModule } from "src/mailer/mailer.module";

@Module({
    imports: [TypeOrmModule.forFeature([Subscription]), StripeModule, MembershipsModule, UsersModule,MailerModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionsRepository],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}