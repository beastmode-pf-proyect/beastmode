import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscription } from "../entities/subscription.entity";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";
import { UsersService } from "src/users/users.service";
import { MembershipsService } from "src/memberships/memberships.service";

@Injectable()
export class SubscriptionsRepository {
    constructor(
        @InjectRepository(Subscription)
        private readonly repository: Repository<Subscription>,
        private userService: UsersService,
        private membershipService: MembershipsService,
    ) {}

    async create(data: CreateSubscriptionDto): Promise<Subscription> {
        const user = await this.userService.getUserById(data.userId);
        const membershipPlan = await this.membershipService.getMembershipById(data.membershipPlanId);

        if (!user || !membershipPlan) {
            throw new Error('User or MembershipPlan not found');
        }

        const subscription = this.repository.create({
            ...data,
            user,
            membershipPlan,
        });
    
        return this.repository.save(subscription);
    }

    async find(options?: any): Promise<Subscription[]> {
        return this.repository.find({          
            relations: ["user", "membershipPlan"],
            ...options
        });
    }

    async findOne(options: any): Promise<Subscription | undefined> {
        return this.repository.findOne({
            relations: ["user", "membershipPlan"],
            ...options
        });
    }

    async update(id: string, data: UpdateSubscriptionDto): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repository.update(id, { 
            isActive: false,
            endDate: new Date()
        });
    }

    async restore(id: string): Promise<void> {
        await this.repository.update(id, { isActive: true });
    }

}