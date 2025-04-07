import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscription } from "../entities/subscription.entity";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";

@Injectable()
export class SubscriptionsRepository {
    constructor(
        @InjectRepository(Subscription)
        private readonly repository: Repository<Subscription>
    ) {}

    async create(data: CreateSubscriptionDto): Promise<Subscription> {
        const subscription = this.repository.create(data);
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
        const result = await this.repository.update(id, { 
            isActive: false,
            endDate: new Date()
        });
    
        if (result.affected === 0) {
            throw new NotFoundException("Exercise not found"); 
        }
    }

    async restore(id: string): Promise<void> {
        await this.repository.update(id, { isActive: true });
    }

}