import { BadRequestException, Injectable } from '@nestjs/common';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { SubscriptionsService } from 'src/suscriptions/suscriptions.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly subscriptionsService: SubscriptionsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async payment(id: string, membershipId: string) {
    const membershipSearch =
      await this.membershipsRepository.getMembershipById(membershipId);

    if (!membershipSearch) {
      throw new BadRequestException('Plan de membresía no encontrado.');
    }

    try {
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
        success_url: `http://localhost:3001/subscriptions/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transactionId}`,
        cancel_url: 'http://localhost:3001/subscriptions/cancel',
        mode: 'payment',
      });

      await this.storePendingTransaction(transactionId, id, membershipId);

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error(`Error al crear la sesión de pago: ${error.message}`);
      throw new BadRequestException(
        'Ocurrió un error al efectuar el pago, por favor intente nuevamente',
      );
    }
  }
  // Método para almacenar temporalmente la transacción pendiente
  private async storePendingTransaction(
    transactionId: string,
    userId: string,
    membershipId: string,
  ) {
    // Aquí podrías almacenar en tu base de datos una transacción "pendiente"
    // Por simplicidad, este ejemplo no implementa el almacenamiento actual
  }

  async verifyPaymentAndCreateSubscription(
    sessionId: string,
    transactionId: string,
  ) {


    // Validar parámetros
    if (!sessionId || !transactionId) {
      throw new BadRequestException('Faltan parámetros para verificar el pago');
    }

    try {
      // Recuperar sesión de Stripe
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const [userId, membershipId] = transactionId.split('_', 2);

        if (!userId || !membershipId) {
          throw new BadRequestException('Formato de transactionId inválido');
        }

        // Crear suscripción en la base de datos
        const subscription = await this.subscriptionsService.create({
          userId,
          membershipPlanId: membershipId,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          isPago: true,
          isActive: true,
        });

        return {
          success: true,
          message: 'Suscripción activada correctamente',
        };
      }

      return {
        success: false,
        message: 'El pago no se ha completado correctamente',
      };
    } catch (error) {
      console.error('❌ Error al verificar el pago:', error);
      throw new BadRequestException('Error al verificar el pago');
    }
  }
}
