import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  
  // 🔁 Verificar pago y activar suscripción después del redireccionamiento de Stripe
  @Post('verify')
  verifyPayment(@Body() body: { sessionId: string; transactionId: string }) {
    return this.stripeService.verifyPaymentAndCreateSubscription(
      body.sessionId,
      body.transactionId,
    );
  }
  
  // Iniciar pago
  @Post(':id')
  checkout(@Param('id') id: string, @Body('id') membershipId: string) {
    return this.stripeService.payment(id, membershipId);
  }
}
