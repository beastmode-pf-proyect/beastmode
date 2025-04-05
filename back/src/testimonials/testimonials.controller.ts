import { Controller, Get } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';


@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

    @Get()
    addTestimonials() {
      return this.testimonialsService.addTestimonials();
  }
}