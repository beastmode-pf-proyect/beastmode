import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { updateMembershipDto } from 'src/dto/updateMembershipDto';
import { MembershipPlan } from 'src/entities/membership.plan.entity';
import { validateMembershipInteceptor } from 'src/interceptors/validateMembership.interceptor';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  getMemberships(){
    return this.membershipsService.getMemberships()
  }

  @Get(':id')
  getMembershipById(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.getMembershipById(id)
  }
  
  @Post('create')
  @UseInterceptors(validateMembershipInteceptor)
  createMembership(@Body()membership: Partial<MembershipPlan>){
    return this.membershipsService.createMembership(membership)
  }
  
  @Put('desactivate/:id')
  desactivateMembership(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.desactivateMembership(id)
  }
  
  @Put('activate/:id')
  activateMembership(@Param('id', ParseUUIDPipe) id: string){
    return this.membershipsService.activateMembership(id)
  }

  @Put(':id')
  @UseInterceptors(validateMembershipInteceptor)
  updateMembership(@Param('id', ParseUUIDPipe) id: string, updateMembership: updateMembershipDto){
    return this.membershipsService.updateMembership(id, updateMembership)
  }

}
