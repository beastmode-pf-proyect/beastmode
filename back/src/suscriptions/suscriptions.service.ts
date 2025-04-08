import { Injectable, NotFoundException } from "@nestjs/common";
import { SubscriptionsRepository } from "./suscriptions.repository";
import { Subscription } from "../entities/subscription.entity";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";

@Injectable()
export class SubscriptionsService {
    constructor(private readonly repository: SubscriptionsRepository) {}

    async create(data: CreateSubscriptionDto): Promise<Subscription> {
        if (data.startDate >= data.endDate) {
            throw new Error('End date must be after start date');
        }
        return this.repository.create(data);
    }

    async findAll(): Promise<Subscription[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<Subscription> {
        const subscription = await this.repository.findOne({ where: { id } });
        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }
        return subscription;
    }
    
    async update(id: string, data: UpdateSubscriptionDto): Promise<Subscription> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async restore(id: string): Promise<void> {
        await this.repository.restore(id);
    }
}