import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { SubscriptionsService } from 'src/suscriptions/suscriptions.service';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async payment(id: string, membershipId: string) {
    const membershipSearch = await this.membershipsRepository.getMembershipById(membershipId);

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
        success_url: `https://beastmode-diph-flzhx826k-beastmodes-projects-d14b9acd.vercel.app/subscriptions/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transactionId}`,
        cancel_url: 'https://beastmode-diph-flzhx826k-beastmodes-projects-d14b9acd.vercel.app/subscriptions/cancel',
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

  private async storePendingTransaction(
    transactionId: string,
    userId: string,
    membershipId: string,
  ) {
    // Espacio para lógica futura de almacenamiento de transacción
  }

  async verifyPaymentAndCreateSubscription(sessionId: string, transactionId: string) {
    if (!sessionId || !transactionId) {
      throw new BadRequestException('Faltan parámetros para verificar el pago');
    }

    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const [userId, membershipId] = transactionId.split('_', 2);

        if (!userId || !membershipId) {
          throw new BadRequestException('Formato de transactionId inválido');
        }

        // Crear suscripción
        await this.subscriptionsService.create({
          userId,
          membershipPlanId: membershipId,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          isPago: true,
          isActive: true,
        });

        const user = await this.userService.getUserById(userId);

        if (!user?.email || !user?.name) {
          throw new BadRequestException('Información de usuario incompleta');
        }

        // Enviar correo personalizado
        try {
          await this.mailerService.sendEmail({
            to: user.email,
            subject: '¡Pago confirmado!',
            html: `
              <h1>Hola ${user.name}, ¡Gracias por tu compra!</h1>
              <p>Tu pago ha sido confirmado correctamente.</p>
              <p>Tu membresía está activa por 30 días.</p>
            `,
          });
        } catch (error) {
          this.logger.error(`Error al enviar correo a ${user.email}:`, error);
          console.error('Error al enviar correo:', error);
          throw new BadRequestException('Error al enviar correo de confirmación: ' + error.message);
        }

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
