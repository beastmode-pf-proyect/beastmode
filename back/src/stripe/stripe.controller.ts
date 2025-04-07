import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SubscriptionsService } from 'src/suscriptions/suscriptions.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    // Endpoint para iniciar el proceso de pago
    @Post(':id')
    checkout(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body('id', ParseUUIDPipe) membershipId: string
    ) {
        return this.stripeService.payment(id, membershipId);
    }
}

