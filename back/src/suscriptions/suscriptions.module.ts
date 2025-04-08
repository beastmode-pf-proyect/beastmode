import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionsRepository } from "./suscriptions.repository";
import { SubscriptionsService } from "./suscriptions.service";
import { SubscriptionsController } from "./suscriptions.controller";
import { StripeModule } from "src/stripe/stripe.module";
import { UsersService } from "src/users/users.service";
import { MembershipsService } from "src/memberships/memberships.service";
import { UsersRepository } from "src/users/users.repository";
import { MembershipsRepository } from "src/memberships/memberships.repository";
import { User } from "src/entities/users.entity";
import { MembershipPlan } from "src/entities/membership.plan.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Subscription, User, MembershipPlan]), StripeModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionsRepository, UsersRepository, UsersService, MembershipsService , MembershipsRepository],
    exports: [SubscriptionsService]
})
export class SubscriptionsModule {}