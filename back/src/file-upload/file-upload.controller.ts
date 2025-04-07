import { Controller, Post,Param, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('user/uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProduct(
    @Param('id') id: string,
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
                    fileType: /(jpg|jpeg|png|webp)$/,
                }),
            ],
        })
    ) file: Express.Multer.File,// Archivo validado.
) {
  // Sube la imagen y la asocia al producto.
    return await this.fileUploadService.uploadUserImage(file, id);
}

  @Post('exercise/uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExercise(
    @Param('id') id: string,
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
                    fileType: /(jpg|jpeg|png|webp)$/,
                }),
            ],
        })
    ) file: Express.Multer.File,// Archivo validado.
) {
  // Sube la imagen y la asocia al producto.
    return await this.fileUploadService.uploadExerciseImage(file, id);  
}


    @Post('workout/uploadImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async uploadWorkout(
      @Param('id') id: string,
      @UploadedFile( // Valida el archivo.
          new ParseFilePipe({
              validators: [
                // Valida que el archivo no sea muy grande.
                  new MaxFileSizeValidator({
                    maxSize: 50000000, // 50MB para videos
                    message: 'El tamaño máximo permitido para videos es de 50MB',
                  }),
                  // Valida que el archivo sea una imagen.
                  new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp|mp4|mov|avi|mkv)$/,
                  }),
              ],
          })
      ) file: Express.Multer.File,// Archivo validado.
      ) {
        // Sube la imagen y la asocia al workout.
          return await this.fileUploadService.uploadWorkoutImage(file, id);
      }

  
}