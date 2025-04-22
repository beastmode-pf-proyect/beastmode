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
        success_url: `http://localhost:3001/subscriptions/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transactionId}`,
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
        const membership = await this.membershipsRepository.getMembershipById(membershipId);

        if (!user?.email || !user?.name) {
          throw new BadRequestException('Información de usuario incompleta');
        }

        // Enviar correo personalizado
        try {
          await this.mailerService.sendEmail({
            to: user.email,
            subject: '¡Tu membresía premium está activa! 🎉',
            html: `
              <div style="
                background: linear-gradient(135deg, #f9f5f5 0%, #f0ebeb 100%);
                padding: 40px 20px;
                font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
                max-width: 600px;
                margin: 0 auto;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(94, 25, 20, 0.1);
              ">
                <!-- Header con logo y gradiente -->
                <div style="
                  background: linear-gradient(135deg, #5e1914 0%, #7a241e 100%);
                  padding: 30px 20px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  color: white;
                  margin-bottom: 30px;
                ">
                  <img src="https://res.cloudinary.com/dbsv0u7h3/image/upload/v1743359702/visj3jouuj5qywu2oxtm.png" 
                       alt="Logo" 
                       style="max-width: 120px; margin-bottom: 15px; filter: brightness(0) invert(1);"/>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">¡Bienvenido a Premium!</h1>
                  <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Tu acceso exclusivo ha sido activado</p>
                </div>
        
                <!-- Contenido principal -->
                <div style="
                  background: white;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                  box-shadow: 0 5px 15px rgba(94, 25, 20, 0.05);
                  border: 1px solid #f0e6e6;
                ">
                  <p style="font-size: 18px; color: #333; margin-bottom: 25px; line-height: 1.6;">
                    Hola <strong style="color: #5e1914;">${user.name}</strong>,<br>
                    Gracias por confiar en nosotros. Aquí tienes los detalles de tu membresía premium:
                  </p>
        
                  <!-- Tarjeta de membresía -->
                  <div style="
                    background: #fdf9f9;
                    border: 1px solid #f0e6e6;
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                  ">
                    <div style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 5px;
                      height: 100%;
                      background: #5e1914;
                    "></div>
                    <h2 style="margin-top: 0; color: #5e1914; font-size: 22px; display: flex; align-items: center;">
                      <span style="
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        background: #5e1914;
                        color: white;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 24px;
                        margin-right: 10px;
                        font-size: 14px;
                      ">✓</span>
                      ${membership.name}
                    </h2>
                    
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                      <div style="flex: 1; min-width: 150px;">
                        <p style="margin: 12px 0; color: #666; font-size: 15px;">
                          <strong style="color: #5e1914; display: block; font-size: 13px; margin-bottom: 3px;">INVERSIÓN</strong>
                          <span style="font-size: 18px; font-weight: 600; color: #5e1914;">$${membership.price} USD</span>
                        </p>
                      </div>
                      <div style="flex: 1; min-width: 150px;">
                        <p style="margin: 12px 0; color: #666; font-size: 15px;">
                          <strong style="color: #5e1914; display: block; font-size: 13px; margin-bottom: 3px;">VÁLIDA POR</strong>
                          30 días
                        </p>
                      </div>
                      <div style="flex: 1; min-width: 150px;">
                        <p style="margin: 12px 0; color: #666; font-size: 15px;">
                          <strong style="color: #5e1914; display: block; font-size: 13px; margin-bottom: 3px;">VENCE EL</strong>
                          ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
        
                  <!-- Beneficios -->
                  <div style="margin-bottom: 30px;">
                    <h3 style="color: #5e1914; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center;">
                      <span style="
                        display: inline-block;
                        margin-right: 10px;
                        color: #5e1914;
                      ">✦</span>
                      Beneficios exclusivos
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                      <div style="background: #fdf9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #5e1914;">
                        <p style="margin: 0; font-weight: 600; color: #5e1914; font-size: 15px;">Rutinas premium</p>
                        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Acceso ilimitado a todas las rutinas avanzadas</p>
                      </div>
                      <div style="background: #fdf9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #5e1914;">
                        <p style="margin: 0; font-weight: 600; color: #5e1914; font-size: 15px;">Seguimiento</p>
                        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Monitoreo detallado de tu progreso</p>
                      </div>
                      <div style="background: #fdf9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #5e1914;">
                        <p style="margin: 0; font-weight: 600; color: #5e1914; font-size: 15px;">Entrenadores</p>
                        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Asesoramiento de expertos</p>
                      </div>
                      <div style="background: #fdf9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #5e1914;">
                        <p style="margin: 0; font-weight: 600; color: #5e1914; font-size: 15px;">Contenido VIP</p>
                        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Material exclusivo cada semana</p>
                      </div>
                    </div>
                  </div>
        
                  <!-- Botón CTA -->
                  <div style="text-align: center; margin: 40px 0 20px;">
                    <a href="https://tudominio.com/dashboard" 
                       style="
                         display: inline-block;
                         background: #5e1914;
                         color: white;
                         padding: 14px 35px;
                         text-decoration: none;
                         border-radius: 8px;
                         font-weight: 600;
                         font-size: 16px;
                         box-shadow: 0 4px 15px rgba(94, 25, 20, 0.3);
                         transition: all 0.3s ease;
                         border: 1px solid #5e1914;
                       "
                       onmouseover="this.style.background='#7a241e'; this.style.boxShadow='0 6px 20px rgba(94, 25, 20, 0.4)';"
                       onmouseout="this.style.background='#5e1914'; this.style.boxShadow='0 4px 15px rgba(94, 25, 20, 0.3)';"
                    >
                      Comenzar mi experiencia premium
                    </a>
                  </div>
        
                  <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
                    ¿Necesitas ayuda? <a href="mailto:soporte@tudominio.com" style="color: #5e1914; text-decoration: none; font-weight: 500;">Contáctanos</a>
                  </p>
                </div>
        
                <!-- Footer -->
                <div style="
                  text-align: center;
                  margin-top: 40px;
                  color: #999;
                  font-size: 13px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                ">
                  <p style="margin: 5px 0;">© ${new Date().getFullYear()} Fitness Premium. Todos los derechos reservados.</p>
                  <p style="margin: 5px 0;">Si no solicitaste este correo, por favor <a href="mailto:abuse@tudominio.com" style="color: #5e1914;">repórtalo</a></p>
                </div>
              </div>
            `,
          });
        } catch (error) {
          this.logger.error(`Error al enviar correo a ${user.email}:, error`);
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
