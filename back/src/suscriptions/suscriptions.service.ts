/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SubscriptionsRepository } from "./suscriptions.repository";
import { Subscription } from "../entities/subscription.entity";
import { CreateSubscriptionDto } from "src/dto/createSubscriptionDto";
import { UpdateSubscriptionDto } from "src/dto/UpdateSubscriptionDto";
import { MailerService } from "src/mailer/mailer.service";
import { format, addDays, startOfDay, endOfDay } from 'date-fns'; // Importar startOfDay y endOfDay
import { Between } from "typeorm";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(
        private readonly repository: SubscriptionsRepository,
        private readonly mailerService: MailerService,
    ) {}

    async create(data: CreateSubscriptionDto): Promise<Subscription> {
        if (data.startDate >= data.endDate) {
            throw new Error('End date must be after start date');
        }
        // Nota: Asumiendo que el repositorio maneja la configuración automática de `createdAt` y `updatedAt`.
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

    // Método para obtener suscripciones próximas a vencer (dentro de 30 días)
    // Dado que las membresías duran 30 días, esto incluirá automáticamente
    // las membresías creadas hoy.
    async getExpiringSubscriptions(): Promise<Subscription[]> {
        const today = startOfDay(new Date()); // Inicio de hoy
        // Ajustamos el rango a 30 días a partir de hoy,
        // lo que incluirá las que vencen EXACTAMENTE en 30 días (creadas hoy)
        const thirtyDaysLater = endOfDay(addDays(today, 31));

        this.logger.log(`Checking for active subscriptions expiring between ${format(today, 'yyyy-MM-dd HH:mm:ss.SSS')} and ${format(thirtyDaysLater, 'yyyy-MM-dd HH:mm:ss.SSS')}`);

        try {
            const expiring = await this.repository.find({
                where: {
                    isActive: true,
                    endDate: Between(today, thirtyDaysLater),
                },
                relations: ['user'] // Asegurar que la relación de usuario se carga para obtener el correo electrónico
            });

            this.logger.log(`Found ${expiring.length} subscriptions expiring in the next 30 days.`);
            return expiring;

        } catch (error) {
            this.logger.error('Error fetching expiring subscriptions:', error.stack);
            throw new Error('Failed to fetch expiring subscriptions');
        }
    }


    @Cron('0,5,10,15,20,25,30 20 * * *') // Se ejecuta en la hora programada (cada 15 minutos a las 20:xx)
    async handleSubscriptionExpirationCheck() {
        this.logger.log('Running subscription check cron job (checking for expiration within 30 days)...');

        try {
            // Obtener suscripciones que vencen en los próximos 30 días.
            // Esto incluye las creadas hoy, ya que su vigencia es de 30 días.
            const subscriptionsToSendEmail = await this.getExpiringSubscriptions();

            if (subscriptionsToSendEmail.length === 0) {
               this.logger.log('No subscriptions found expiring in the next 30 days.');
               return;
            }

            this.logger.log(`Found ${subscriptionsToSendEmail.length} subscriptions to process.`);

            for (const subscription of subscriptionsToSendEmail) {
                // Verificar si el usuario y el correo existen antes de enviar
                if (!subscription.user || !subscription.user.email) {
                     this.logger.warn(`Subscription ID ${subscription.id} (User ID: ${subscription.user?.id || 'N/A'}) has no associated user or email. Skipping email.`);
                     continue;
                }

                const formattedEndDate = format(new Date(subscription.endDate), 'dd/MM/yyyy'); // Formatea la fecha
                const daysRemaining = Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                // Asegurar que daysRemaining no sea negativo si la suscripción ya ha expirado ligeramente
                const displayDaysRemaining = daysRemaining > 0 ? `${daysRemaining} días` : 'menos de 1 día';


                const emailSubject = 'Tu membresia está por vencer ⏳'; // El asunto permanece igual

                // La estructura HTML permanece igual, usando datos de la suscripción dinámicamente
                const emailHtml = `
                 <div style="
                 background: linear-gradient(135deg, #f9f5f5 0%, #f0ebeb 100%);
                 padding: 40px 20px;
                 font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
                 max-width: 600px;
                 margin: 0 auto;
                 border-radius: 12px;
                 box-shadow: 0 10px 30px rgba(94, 25, 20, 0.1);
                 ">
                 <div style="
                     background: linear-gradient(135deg, #5e1914 0%, #7a241e 100%);
                     padding: 30px 20px;
                     border-radius: 10px 10px 0 0;
                     text-align: center;
                     color: white;
                     margin-bottom: 30px;
                 ">
                     <img src="https://res.cloudinary.com/dbsv0u7h3/image/upload/v1745434841/visj3jouuj5qywu2oxtm.png"
                          alt="Logo"
                          style="max-width: 120px; margin-bottom: 15px; filter: brightness(0) invert(1);"/>
                     <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">¡Tu membresia está por expirar!</h1>
                     <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Renueva para continuar disfrutando de todos los beneficios</p>
                 </div>

                 <div style="
                     background: white;
                     padding: 30px;
                     border-radius: 0 0 10px 10px;
                     box-shadow: 0 5px 15px rgba(94, 25, 20, 0.05);
                     border: 1px solid #f0e6e6;
                 ">
                     <p style="font-size: 18px; color: #333; margin-bottom: 25px; line-height: 1.6;">
                     Hola <strong style="color: #5e1914;">${subscription.user.name}</strong>,<br>
                     Queremos avisarte que tu suscripción está por vencer pronto.
                     </p>

                     <div style="
                     background: #fdf9f9;
                     border: 1px solid #f0e6e6;
                     padding: 25px;
                     border-radius: 8px;
                     margin-bottom: 30px;
                     position: relative;
                     overflow: hidden;
                     text-align: center;
                     ">
                     <div style="
                         position: absolute;
                         top: 0;
                         left: 0;
                         width: 100%;
                         height: 5px;
                         background: #5e1914;
                     "></div>
                     <br />

                     <div style="
                         display: inline-block;
                         width: 60px;
                         height: 60px;
                         background: #fdf9f9;
                         border: 2px solid #5e1914;
                         border-radius: 50%;
                         margin-bottom: 20px;
                         line-height: 60px;
                         text-align: center;
                     ">
                         <span style="
                         color: #5e1914;
                         font-size: 28px;
                         font-weight: bold;
                         ">!</span>
                     </div>

                     <h2 style="margin: 0 0 15px; color: #5e1914; font-size: 22px;">
                         Fecha de vencimiento: <strong>${formattedEndDate}</strong>
                     </h2>

                     
                     </div>

                     <div style="margin-bottom: 30px;">
                     <h3 style="color: #5e1914; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                         <span style="display: inline-block; margin-right: 10px; color: #5e1914;">✦</span>
                         ¿Por qué renovar tu membresía?
                     </h3>

                     <ul style="padding-left: 0; margin: 0; list-style: none;">
                         <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
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
                             flex-shrink: 0;
                         ">1</span>
                         <span style="color: #555; font-size: 15px;">Continúa tu progreso sin interrupciones</span>
                         </li>
                         <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
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
                             flex-shrink: 0;
                         ">2</span>
                         <span style="color: #555; font-size: 15px;">Mantén acceso a contenido exclusivo</span>
                         </li>
                         <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
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
                             flex-shrink: 0;
                         ">3</span>
                         <span style="color: #555; font-size: 15px;">Conserva tus estadísticas y logros</span>
                         </li>
                     </ul>
                     </div>

                     <div style="text-align: center; margin: 40px 0 20px;">
                     <a href="https://tudominio.com/renovar-suscripcion"
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
                         Renovar ahora
                     </a>
                     </div>

                     <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
                     ¿Preguntas sobre tu suscripción? <a href="mailto:soporte@tudominio.com" style="color: #5e1914; text-decoration: none; font-weight: 500;">Contáctanos</a>
                     </p>
                 </div>

                 <div style="
                     text-align: center;
                     margin-top: 40px;
                     color: #999;
                     font-size: 13px;
                     padding-top: 20px;
                     border-top: 1px solid #eee;
                 ">
                     <p style="margin: 5px 0;">© ${new Date().getFullYear()} Fitness Premium. Todos los derechos reservados.</p>
                     <p style="margin: 5px 0;">Este es un correo automático, por favor no responder</p>
                 </div>
                 </div>
                 `;


                const recipientEmail = subscription.user.email; // Ya se verificó la existencia arriba

                try {
                    await this.mailerService.sendEmail({
                        to: recipientEmail,
                        subject: emailSubject,
                        html: emailHtml,
                    });
                     this.logger.log(`Sent expiration email to ${recipientEmail} for subscription ID ${subscription.id} (Expiring in ${displayDaysRemaining}).`);
                } catch (emailError) {
                    this.logger.error(`Failed to send email to ${recipientEmail} for subscription ID ${subscription.id}:`, emailError.stack);
                }
            }

            this.logger.log('Subscription check cron job finished.');
        } catch (error) {
            this.logger.error('Error during subscription check cron job:', error.stack);
        }
    }
}