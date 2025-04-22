import { Controller, Get, Query, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  private readonly logger = new Logger(MailerController.name);

  constructor(private readonly mailerService: MailerService) {}

  @Get('test') 
  async sendTestEmail(@Query('to') recipientEmail?: string) {
    const testEmail = recipientEmail || 'test@example.com';
    const subject = 'Correo de Prueba - NestJS Mailer';
    const htmlContent = `
      <h1>¡Hola!</h1>
      <p>Este es un correo de prueba enviado desde tu aplicación NestJS.</p>
      <p>La configuración del servicio ${this.mailerService['configService'].get('EMAIL_SERVICE')} parece funcionar.</p>
    `;

    this.logger.log(`Intentando enviar correo de prueba a: ${testEmail}`);

    try {
      await this.mailerService.sendEmail({
        to: testEmail,
        subject: subject,
        html: htmlContent,
      });
      this.logger.log(`Correo de prueba enviado exitosamente a ${testEmail}`);
      return { message: `Correo de prueba enviado exitosamente a ${testEmail}` };
    } catch (error) {
      this.logger.error(`Error al enviar correo de prueba a ${testEmail}:`, error.stack);
      throw new HttpException(
        `Error al enviar correo de prueba: ${error.message || 'Error desconocido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
