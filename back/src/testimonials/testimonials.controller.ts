import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { Testimony } from 'src/entities/testimonies.entity';
import { TestimonialsValidationInterceptor } from 'src/interceptors/testimonials.interceptor';


@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

    @Post()
    @UseInterceptors(TestimonialsValidationInterceptor)
    addTestimonials(@Body() testimonies: Partial<Testimony>) {
      return this.testimonialsService.addTestimonial(testimonies);
  }

  @Get()
  getTestimonials(){
    return this.testimonialsService.getTestimonials()
  }

  @Put(':id')
  aproveTestimonial(@Param('id') id: string, @Body() updateTestimonial: Partial<Testimony>){
    return this.testimonialsService.updateTestimonial(id, updateTestimonial)
  }
}