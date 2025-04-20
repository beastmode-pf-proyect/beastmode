// mailer.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus, Logger, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  private readonly logger = new Logger(MailerController.name);

  constructor(private readonly mailerService: MailerService) {}

  @Get('test') // Cambiado de @Post a @Get para que funcione como esperas
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

  // mailer.controller.ts
@Post('welcome')
async sendWelcomeEmail(@Body() body: { email: string, name?: string }) {
  const { email, name } = body;
  
  const subject = '¡Bienvenido a nuestra plataforma!';
  const htmlContent = `
    <div style="background-color:#f9f9f9; padding:20px; border-radius:10px; font-family: sans-serif;">
                <div style="text-align:center; margin-bottom:20px;">
                  <img src="https://res.cloudinary.com/dbsv0u7h3/image/upload/v1743359702/visj3jouuj5qywu2oxtm.png" alt="Logo" style="max-width:100px;"/>
                  <h1 style="color:#333; margin-top:0;">¡Pago confirmado!</h1>
                </div>   
    <h1 style="color:#555; font-size:16px;">Hola <strong>${name || 'Usuario'}!</strong>,</h1>
    <p>Gracias por registrarte en nuestra plataforma.</p>
    <p>Estamos encantados de tenerte con nosotros.</p>
  `;

  try {
    await this.mailerService.sendEmail({
      to: email,
      subject,
      html: htmlContent,
    });
    return { message: 'Correo de bienvenida enviado exitosamente' };
  } catch (error) {
    this.logger.error(`Error al enviar correo de bienvenida a ${email}:`, error.stack);
    throw new HttpException(
      `Error al enviar correo de bienvenida: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}



}
