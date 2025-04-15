import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesRepository],
  controllers:[RolesController],
  exports: [RolesService]
})
export class RolesModule {}
