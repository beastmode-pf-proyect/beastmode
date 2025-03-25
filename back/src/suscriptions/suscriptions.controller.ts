import { Controller } from '@nestjs/common';
import { SuscriptionsService } from './suscriptions.service';

@Controller('suscriptions')
export class SuscriptionsController {
  constructor(private readonly suscriptionsService: SuscriptionsService) {}
}
