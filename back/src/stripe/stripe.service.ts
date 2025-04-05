import { BadRequestException, Injectable } from '@nestjs/common';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { SubscriptionsService } from 'src/suscriptions/suscriptions.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly subscriptionsService: SubscriptionsService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async payment(id: string, membershipId: string) {
    const membershipSearch = await this.membershipsRepository.getMembershipById(membershipId);

    try {
      // Generar un ID único para esta transacción
      const transactionId = `${id}_${membershipId}_${Date.now()}`;
      
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: membershipSearch.name,
              },
              unit_amount: membershipSearch.price * 100,
            },
            quantity: 1,
          },
        ],
        // Incluir el ID de transacción como parámetro en la URL
        success_url: `http://localhost:3000/subscriptions/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transactionId}`,
        cancel_url: 'http://localhost:3000/subscriptions/cancel',
        mode: 'payment',
      });

      // Guardar información temporal de la transacción para posterior verificación
      await this.storePendingTransaction(transactionId, id, membershipId);

      return { sessionId: session.id, url: session.url };

    } catch (error) {
      throw new BadRequestException('Ocurrió un error al efectuar el pago, por favor intente nuevamente');
    }
  }

  // Método para almacenar temporalmente la transacción pendiente
  private async storePendingTransaction(transactionId: string, userId: string, membershipId: string) {
    // Aquí podrías almacenar en tu base de datos una transacción "pendiente"
    // Por simplicidad, este ejemplo no implementa el almacenamiento actual
  }

  // Método que se llamará desde el controlador cuando el usuario sea redirigido a la URL de éxito
  async verifyPaymentAndCreateSubscription(sessionId: string, transactionId: string) {
    try {
      // Verificar el estado de la sesión de pago
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      // Verificar que el pago fue exitoso
      if (session.payment_status === 'paid') {
        // Extraer los IDs del transactionId
        const [userId, membershipId] = transactionId.split('_', 2);
        
        // Crear la suscripción en la base de datos
        await this.subscriptionsService.create({
          userId: userId,
          membershipPlanId: membershipId,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          isPago: true,
          isActive: true,
        });
        
        return { success: true, message: 'Suscripción activada correctamente' };
      }
      
      return { success: false, message: 'El pago no se ha completado correctamente' };
      
    } catch (error) {
      throw new BadRequestException('Error al verificar el pago');
    }
  }
}
