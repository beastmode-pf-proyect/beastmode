import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/dto/updateUserDto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuardian } from 'src/guards/authorization.guard';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express-jwt';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  getUsers(){
    return this.usersService.getUsers();
  }

  @Get(':id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuardian)
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: updateUserDto){
    return this.usersService.updateUser(id, updateUser);
  }

  @Put('/Admin/:id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuardian, RolesGuard)
  updatetrainerUser(@Param('id', ParseUUIDPipe) id: string){
    return this.usersService.updatetrainerUser(id);
}


///// AUTH

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  async getUserProfile(@Req() req: Request) {
    const auth0Id = req.user['sub'];
    return this.usersService.getUserProfile(auth0Id);
  }

}

