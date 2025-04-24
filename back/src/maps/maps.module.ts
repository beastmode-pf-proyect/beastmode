import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapsService } from './maps.service';
import { GymLocation } from '../entities/maps.entity';
import { MapsController } from './maps.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([GymLocation])
  ],
  providers: [MapsService],
  exports: [MapsService],
  controllers: [MapsController],
})
export class MapsModule {}
