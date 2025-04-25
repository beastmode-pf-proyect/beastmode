import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/dto/updateUserDto';
import { FileInterceptor } from '@nestjs/platform-express';


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
  @UseInterceptors(FileInterceptor('file'))
  updateUser(@Param('id') id: string,
   @Body() userName: updateUserDto,
   @UploadedFile( // Valida el archivo.
          new ParseFilePipe({
              validators: [
                // Valida que el archivo no sea muy grande.
                  new MaxFileSizeValidator({
                      maxSize: 2000000,
                      message: 'Tamaño de la imagen permitido es de 2MB',
                  }),
                  // Valida que el archivo sea una imagen.
                  new FileTypeValidator({
                      fileType: /(jpg|jpeg|png|webp|gif|mp4)$/,
                  }),
              ],
          })
      ) file: Express.Multer.File,// Archivo validado
      ){
    return this.usersService.updateUser(id, userName, file);
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

