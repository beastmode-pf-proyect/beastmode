import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionsRepository } from "./suscriptions.repository";
import { SubscriptionsService } from "./suscriptions.service";
import { SubscriptionsController } from "./suscriptions.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Subscription])],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionsRepository],
    exports: [SubscriptionsRepository] 
})
export class SubscriptionsModule {}