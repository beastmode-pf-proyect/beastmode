
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();  

  }

  private initializeTransporter() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    // Verificar conexión al inicializar
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Connection to email server established');
    } catch (error) {
      this.logger.error('Failed to establish email connection:', error);
      throw new Error('Failed to establish email connection');
    }
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      ...options,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${options.to}`, error.stack);
      throw error;
    }
  }
}