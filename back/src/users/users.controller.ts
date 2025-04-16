import { Body, Controller, Delete, Get, Param, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/dto/updateUserDto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  getUsersTrainerAndClient(){
    return this.usersService.getUsersTrainerAndClient();
  }

  @Get('/trainer')
  getUsersTrainer(){
    return this.usersService.getUsersTrainer();
  }

  @Get('/client')
  getUsersClient(){
    return this.usersService.getUsersClient();
  }

  @Get('/role/:id')
  getRoleById(@Param('id') id: string) {
    return this.usersService.getRoleByUserId(id);
  }

  @Get('subOfClient/:id')   
  async getSubscriptions(@Param('id') id: string) {
      return this.usersService.getSubscriptionsByUserId(id);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('/:id/:role')
  getUserByIdAndRole(@Param('id') id: string, @Param('role') role: string) {
    return this.usersService.getUserByIdAndRole(id, role);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: updateUserDto){
    return this.usersService.updateUser(id, updateUser);
  }

  @Put('/upRole/:id')
  updateRoleUser(@Param('id') id: string, @Body('role') role: string){
    return this.usersService.updateRoleUser(id, role);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
  return this.usersService.deleteUser(id);
  }

  @Put('desactivate/:id')
  desactivateUser(@Param('id') id: string){
    return this.usersService.desactivateUser(id)
  }

  @Put('activate/:id')
  activateUser(@Param('id') id: string){
    return this.usersService.activateUser(id)
  } 

}

