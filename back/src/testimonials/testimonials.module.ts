import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { testimoniesRepository } from './testimonies.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimony } from 'src/entities/testimonies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimony])],
  controllers: [TestimonialsController],
  providers: [TestimonialsService,testimoniesRepository],
})
export class TestimonialsModule {}
