import { Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { updateMembershipDto } from 'src/dto/updateMembershipDto';
import { MembershipPlan } from 'src/entities/membership.plan.entity';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/roles.enum';
import { AuthGuardian } from 'src/guards/authorization.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { use } from 'passport';
import { validateMembershipInteceptor } from 'src/interceptors/validateMembership.interceptor';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  getMemberships(){
    return this.membershipsService.getMemberships()
  }

  @Get(':id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  getMembershipById(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.getMembershipById(id)
  }

  @Put(':id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  @UseInterceptors(validateMembershipInteceptor)
  updateMembership(@Param('id', ParseUUIDPipe) id: string, updateMembership: updateMembershipDto){
    return this.membershipsService.updateMembership(id, updateMembership)
  }

  @Post('create')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  @UseInterceptors(validateMembershipInteceptor)
  createMembership(membership: Partial<MembershipPlan>){
    return this.membershipsService.createMembership(membership)
  }

  @Put('desactivate/:id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  desactivateMembership(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.desactivateMembership(id)
  }

  @Put('activate/:id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  activateMembership(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.activateMembership(id)
  }

}
