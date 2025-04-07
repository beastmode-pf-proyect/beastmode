import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe, UseInterceptors } from "@nestjs/common";
import { SubscriptionsService } from "./suscriptions.service";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";
import { Roles } from "src/roles.enum";
import { Role } from "src/decorators/roles.decorators";
import { AuthGuardian } from "src/guards/authorization.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { SubscriptionValidationInterceptor } from "src/interceptors/subscription.interceptor";


@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly service: SubscriptionsService) {}


    @UseInterceptors(SubscriptionValidationInterceptor)
    @Post('create')   
    async create(@Body() data: CreateSubscriptionDto) {
        return this.service.create(data);
    }

    @Get()    
    async findAll() {
        return this.service.findAll();
    }

    @Get(':id')   
    @Role(Roles.Admin)
    @UseGuards(AuthGuardian, RolesGuard)
    async findOne(@Param('id') id: string) {
        return this.service.findById(id);
    }

    @Role(Roles.Admin)
    //@UseGuards(AuthGuardian, RolesGuard)
   // @UseInterceptors(SubscriptionValidationInterceptor)
    @Put(":id")  
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdateSubscriptionDto) {
        return this.service.update(id, data);
    }

    @Role(Roles.Admin)
    //@UseGuards(AuthGuardian, RolesGuard)
    @Delete(":id")
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.service.delete(id);
    }

    @Role(Roles.Admin)
    @UseGuards(AuthGuardian, RolesGuard)
    @Post(":id/restore") 
    async restore(@Param("id", ParseUUIDPipe) id: string) {
        return this.service.restore(id);
    }
}