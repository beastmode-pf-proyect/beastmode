import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { MembershipsRepository } from './memberships.repository';
import { MembershipPlan } from 'src/entities/membership.plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([MembershipPlan])],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository],
})
export class MembershipsModule {}
