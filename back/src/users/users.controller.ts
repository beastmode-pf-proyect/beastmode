import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/dto/updateUserDto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuardian } from 'src/guards/authorization.guard';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // @ApiBearerAuth()
  @Get()
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  getUsers(){
    return this.usersService.getUsers();
  }

  // @ApiBearerAuth()
  @Get(':id')
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  // @ApiBearerAuth()
  @Put(':id')
  // @UseGuards(AuthGuardian)
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: updateUserDto){
    return this.usersService.updateUser(id, updateUser);
  }

  // @ApiBearerAuth()
  @Put('/Admin/:id')
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  updatetrainerUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.updatetrainerUser(id);
  }

  @Delete(':id')
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
  return this.usersService.deleteUser(id);
  }

  @Put('desactivate/:id')
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  desactivateUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.desactivateUser(id)
  }

  @Put('activate/:id')
  // @Role(Roles.Admin)
  // @UseGuards(AuthGuardian, RolesGuard)
  activateUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.activateUser(id)
  } 

}

