import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe, UseInterceptors, Query } from "@nestjs/common";
import { SubscriptionsService } from "./suscriptions.service";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";
import { SubscriptionValidationInterceptor } from "src/interceptors/subscription.interceptor";
import { StripeService } from "src/stripe/stripe.service";


@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly service: SubscriptionsService,
                private readonly stripeService: StripeService
    ) {}


    @UseInterceptors(SubscriptionValidationInterceptor)
    @Post('create')   
    async create(@Body() data: CreateSubscriptionDto) {
        return this.service.create(data);
    }

    @Get()    
    async findAll() {
        return this.service.findAll();
    }

    @UseInterceptors(SubscriptionValidationInterceptor)
    @Put(":id")  
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdateSubscriptionDto) {
        return this.service.update(id, data);
    }

    @Delete(":id")
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.service.delete(id);
    }

    @Post(":id/restore") 
    async restore(@Param("id", ParseUUIDPipe) id: string) {
        return this.service.restore(id);
    }

    @Get(':id')   
    async findOne(@Param('id') id: string) {
        return this.service.findById(id);
    }
    }