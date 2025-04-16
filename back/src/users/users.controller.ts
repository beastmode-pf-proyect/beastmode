import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/dto/updateUserDto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  getUsers(){
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: updateUserDto){
    return this.usersService.updateUser(id, updateUser);
  }

  @Put('/Admin/:id')
  updatetrainerUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.updatetrainerUser(id);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
  return this.usersService.deleteUser(id);
  }

  @Put('desactivate/:id')
  desactivateUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.desactivateUser(id)
  }

  @Put('activate/:id')
  activateUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.activateUser(id)
  } 

}

